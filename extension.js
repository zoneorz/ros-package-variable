const vscode = require('vscode');
const fs = require('fs');
const xml2js = require('xml2js');

function activate(context) {
  const errorMessage = (msg, noObject) => { vscode.window.showErrorMessage(msg); return noObject ? noObject : "Unknown"; };
  const fileNotInFolderError = (noObject) => errorMessage('File not in Multi-root Workspace', noObject);
  const activeTextEditorVariable = (action, args, noEditor) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return errorMessage('No editor', noEditor); }
    return action(editor, args);
  };
  const activeWorkspaceFolder = (action, noWorkSpace) => {                  
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) { return errorMessage('No folder open', noWorkSpace); }
    return activeTextEditorVariable( editor => {
      let folder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
      return folder ? action(folder, editor) : fileNotInFolderError(noWorkSpace); 
    });
  };
  const fileExists = (file) => {
    try {
      fs.statSync(file);
      return true;
    }
    catch (err) {
      if (err.code === 'ENOENT') { return false }
      return true;
    }
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.rosPackageName', () => {
      const fileFolder = activeTextEditorVariable(editor => {
        const path = editor.document.uri.path;
        const lastSep = path.lastIndexOf('/');
        if (lastSep === -1) { return "Unknown"; }
        return path.substring(0, lastSep);
      });
      const workspaceFolder = activeWorkspaceFolder( workspaceFolder => {
        return workspaceFolder.uri.path;
      });
      if (fileFolder === "Unknown" || workspaceFolder === "Unknown") {
        return errorMessage('Active file is unknown ROS package', fileFolder);
      }

      let packageFolder = fileFolder;
      while (workspaceFolder.length < packageFolder.length) {
        if (fileExists(packageFolder + '/package.xml')) {
          try {
            xml2js.parseString(fs.readFileSync(packageFolder + '/package.xml'), (err, result) => {
              if (err) { throw err };
              packageName = result.package.name[0];
            });
            return packageName;
          } catch (error) {
            errorMessage('Failed to parse package.xml', error);
            break;
          }
        }

        const lastIndex = packageFolder.lastIndexOf('/');
        if (lastIndex === -1) {
          break;
        }
        packageFolder = packageFolder.substring(0, lastIndex);
      }

      errorMessage('Active file is unknown ROS package', fileFolder);

      return "Unknown";
    })
  );
};

function deactivate() { }

module.exports = {
  activate,
  deactivate
}
