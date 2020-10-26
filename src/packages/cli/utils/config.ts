import { DaitaContextConfig } from './data-adapter';
import * as fs from 'fs';
import * as path from 'path';
import * as jsonschema from 'jsonschema';

export function getConfig(options: { cwd?: string; context?: string }) {
  const config = getConfigValue(options);

  const schema = getJsonSchema();
  const validation = jsonschema.validate(config, schema);
  if (!validation.valid) {
    throw new Error(`invalid schema: ${validation.errors.map((e) => e.message).join(', ')}`);
  }

  const contextName = options.context || 'default';
  if (!config || !config.context || !config.context[contextName]) {
    throw new Error(`Missing daita context ${contextName} configuration`);
  }
  return config.context[contextName] as DaitaContextConfig;
}

function getConfigValue(options: { cwd?: string }) {
  const configPath = path.join(options?.cwd || process.cwd(), 'daita.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing daita.json configuration, try "npx daita init"`);
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath).toString());
    return config;
  } catch (e) {
    throw new Error(`Unable to parse ${configPath}`);
  }
}

function getJsonSchema() {
  let currentPath = __dirname;
  while (!fs.existsSync(path.join(currentPath, 'package.json'))) {
    currentPath = path.join(currentPath, '..');
  }

  return JSON.parse(fs.readFileSync(path.join(currentPath, 'schema.json')).toString());
}
