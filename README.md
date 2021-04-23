# ROS Package Variable
Visual Studio Code provides ROS package [variable substitution](https://code.visualstudio.com/docs/editor/variables-reference) to be used in `launch.json` and `tasks.json`.

One of the variables allows the [result of a command](https://code.visualstudio.com/docs/editor/variables-reference#_command-variables) to be used with the following syntax: **`${command:commandID}`**

This extension provides a ROS package variable give a result based on the current file and the workspace path

* `extension.rosPackageName` : The ROS package name of the current file.

We can give an extension command arguments with `input variables`,  
but for single numeric arguments putting the argument in the command name is simpler.

## Usage
An example `launch.json` :
```json
{
  "version": "0.2.0",
  "configurations": [
    "name": "cppdbg: ROS run active package",
    "type": "cppdbg",
    "request": "launch",
    "program": "${workspaceFolder}/devel/lib/${input:rosPackageName}/${input:rosPackageName}_node",
    "args": [],
    "stopAtEntry": false,
    "cwd": "${workspaceFolder}",
    "environment": [],
    "externalConsole": false,
    "MIMode": "gdb",
    "setupCommands": [
        {
            "description": "Enable pretty-printing for gdb",
            "text": "-enable-pretty-printing",
            "ignoreFailures": true
        }
    ]
  ],
  "inputs": [
    {
      "id": "rosPackageName",
      "type": "command",
      "command": "extension.rosPackageName",
      "args":{}
    }
  ]
}
```

An example `tasks.json` :
```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [{
            "label": "catkin build active package",
            "type": "shell",
            "command": "catkin build ${command:extension.rosPackageName}",
            "problemMatcher": [],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

You can use a Tasks to [see the value of a variable substitution](https://code.visualstudio.com/docs/editor/variables-reference#_how-can-i-know-a-variables-actual-value).
