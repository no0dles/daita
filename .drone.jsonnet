{
    "kind": "pipeline",
    "type": "docker",
    "name": "default",
    "steps": [
        {
            "name": "build",
            "image": "alpine",
            "commands:": [
                "echo hello world",
            ]
        }
    ]
}
