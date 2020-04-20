local common = import 'packages/common/package.json';
local eslint = import 'packages/eslint-config/package.json';
local relational = import 'packages/relational/package.json';
local document = import 'packages/document/package.json';
local orm = import 'packages/orm/package.json';
local docs = import 'packages/docs/package.json';
local odm = import 'packages/odm/package.json';
local http_adapter = import 'packages/adapters/http/package.json';
local pg_adapter = import 'packages/adapters/pg/package.json';
local mongodb_adapter = import 'packages/adapters/mongodb/package.json';
local websocket_adapter = import 'packages/adapters/websocket/package.json';
local http_server = import 'packages/http-server/package.json';
local cli = import 'packages/cli/package.json';

local image = 'node:12';
local packages = [
    { dir: "packages/eslint-config", config: eslint },
    { dir: "packages/docs", config: docs},
    { dir: "packages/common", config: common},
    { dir: "packages/relational", config: relational},
    { dir: "packages/document", config: document},
    { dir: "packages/orm", config: orm},
    { dir: "packages/odm", config: odm},
    { dir: "packages/http-server", config: http_server},
    { dir: "packages/adapters/http", config: http_adapter},
    { dir: "packages/adapters/mongodb", config: mongodb_adapter},
    { dir: "packages/adapters/pg", config: pg_adapter},
    { dir: "packages/adapters/websocket", config: websocket_adapter},
    { dir: "packages/cli", config: cli},
];

local getDependsOn(map) = ["build:" + item for item in std.objectFields(map) if std.startsWith(item, "@daita")];
local getDependencies(config) =
    (if std.objectHas(config, "dependencies") then getDependsOn(config.dependencies) else []) +
    (if std.objectHas(config, "devDependencies") then getDependsOn(config.devDependencies) else []);

local buildStep(image, pkg) =
    {
        name: "build:" + pkg.config.name,
        image: image,
        commands: [
            ("cd " + pkg.dir),
            "npm install",
            "npm run build"
        ],
        depends_on: getDependencies(pkg.config),
    };

local testStep(image, pkg) =
    {
        name: "test:" + pkg.config.name,
        image: image,
        commands: [
          ("cd " + pkg.dir),
          "npm test"
        ],
        depends_on: getDependencies(pkg.config),
    };

{
    "kind": "pipeline",
    "type": "docker",
    "name": "build",
    "steps":
        [buildStep(image, package) for package in packages]
}
