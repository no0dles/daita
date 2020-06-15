local common = import 'packages/common/package.json';
local eslint = import 'packages/eslint-config/package.json';
local relational = import 'packages/relational/package.json';
local orm = import 'packages/orm/package.json';
local docs = import 'packages/docs/package.json';
local http_adapter = import 'packages/http/http-adapter/package.json';
local pg_adapter = import 'packages/pg-adapter/package.json';
local sqlite_adapter = import 'packages/sqlite-adapter/package.json';
local http_server = import 'packages/http/http-server/package.json';
local cli = import 'packages/cli/package.json';
local create = import 'packages/create/package.json';

local image = 'node:12';
local packages = [
    { dir: "packages/eslint-config", config: eslint, extraSteps: [] },
    { dir: "packages/docs", config: docs,
      extraSteps: [
      {
        "name": "publish",
        "image": "plugins/gh-pages",
        "settings": {
          "pages_directory": "packages/docs/build/"
        },
        "commands": []
      }
      ]
    },
    { dir: "packages/common", config: common, extraSteps: []},
    { dir: "packages/create", config: create, extraSteps: []},
    { dir: "packages/relational", config: relational, extraSteps: []},
    { dir: "packages/orm", config: orm, extraSteps: []},
    { dir: "packages/pg-adapter", config: pg_adapter, extraSteps: []},
    { dir: "packages/sqlite-adapter", config: sqlite_adapter, extraSteps: []},
    { dir: "packages/http/http-server", config: http_server, extraSteps: []},
    { dir: "packages/http/http-adapter", config: http_adapter, extraSteps: []},
    { dir: "packages/cli", config: cli, extraSteps: []},
];

local getDependsOn(map) = [item for item in std.objectFields(map) if std.startsWith(item, "@daita")];
local getDependencies(config) =
    (if std.objectHas(config, "dependencies") then getDependsOn(config.dependencies) else []) +
    (if std.objectHas(config, "devDependencies") then getDependsOn(config.devDependencies) else []);

local pipeline(pkg) =
    {
        "kind": "pipeline",
        "type": "docker",
        "name": pkg.config.name,
        "steps": [
            {
                name: "install",
                image: image,
                commands: [
                  ("cd " + pkg.dir),
                  "npm install"
                ],
            },
            {
                name: "build",
                image: image,
                commands: [
                  ("cd " + pkg.dir),
                  "npm run build"
                ],
            }
        ] + pkg.extraSteps,
        "depends_on": getDependencies(pkg.config)
    };

[pipeline(package) for package in packages]
