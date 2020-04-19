local eslint = import './packages/eslint-config/drone.libsonnet';
local core = import './packages/core/drone.libsonnet';

local image = 'node:12';
local packages = [eslint, core];

local buildStep(image, config) =
    {
        name: "build:" + config.name,
        image: image,
        commands: config.build.commands,
        depends_on: ["build:" + dep for dep in config.depends_on],
    };

local testStep(image, config) =
    {
        name: "test:" + config.name,
        image: image,
        commands: config.test.commands,
        depends_on: ["build:" + dep for dep in config.depends_on],
    };

{
    "kind": "pipeline",
    "type": "docker",
    "name": "build",
    "steps":
        [buildStep(image, package) for package in packages] +
        [testStep(image, package) for package in packages]
}
