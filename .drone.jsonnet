local common = import 'packages/common/package.json';
local eslint = import 'packages/eslint-config/package.json';
local relational = import 'packages/relational/package.json';
local orm = import 'packages/orm/package.json';
local docs = import 'packages/docs/package.json';
local http_adapter = import 'packages/http/http-adapter/package.json';
local http_server_common = import 'packages/http/http-server-common/package.json';
local http_client_common = import 'packages/http/http-client-common/package.json';
local pg_adapter = import 'packages/pg-adapter/package.json';
local sqlite_adapter = import 'packages/sqlite-adapter/package.json';
local http_server = import 'packages/http/http-server/package.json';
local cli = import 'packages/cli/package.json';
local create = import 'packages/create/package.json';

local image = 'node:12';
local packages = [
    { dir: "packages/eslint-config", config: eslint},
    { dir: "packages/docs", config: docs },
    { dir: "packages/common", config: common},
    { dir: "packages/create", config: create},
    { dir: "packages/relational", config: relational},
    { dir: "packages/pg-adapter", config: pg_adapter},
    { dir: "packages/sqlite-adapter", config: sqlite_adapter},
    { dir: "packages/http/http-client-common", config: http_client_common},
    { dir: "packages/http/http-server-common", config: http_server_common},
    { dir: "packages/http/http-server", config: http_server},
    { dir: "packages/http/http-adapter", config: http_adapter},
    { dir: "packages/orm", config: orm},
    { dir: "packages/cli", config: cli},
];

local getDependsOn(map, suffix) = [(item + suffix) for item in std.objectFields(map) if std.startsWith(item, "@daita")];
local getDependencies(config, suffix) =
    (if std.objectHas(config, "dependencies") then getDependsOn(config.dependencies, suffix) else []) +
    (if std.objectHas(config, "devDependencies") then getDependsOn(config.devDependencies, suffix) else []);

local installStep(pkg) =
   {
       name: pkg.config.name + ":install",
       image: image,
       commands: [
         ("cd " + pkg.dir),
         "npm install"
       ],
       "depends_on": getDependencies(pkg.config, ":install")
   };

local buildStep(pkg) =
   {
       name: pkg.config.name + ":build",
       image: image,
       commands: [
         ("cd " + pkg.dir),
         "npm run build"
       ],
       "depends_on": getDependencies(pkg.config, ":install") + getDependencies(pkg.config, ":build") + [(pkg.config.name + ":install")]
   };

[{
     "kind": "pipeline",
     "type": "docker",
     "name": "daita",
     "steps": [installStep(package) for package in packages] +
            [buildStep(package) for package in packages] +
            [
              {
                 "name": "publish",
                 "image": "plugins/gh-pages",
                 "settings": {
                   "pages_directory": "packages/docs/build/"
                 },
                 "commands": [],
                 "depends_on": ["@daita/docs:build"]
              }
            ]
 }]
