import { DaitaContextConfig } from './data-adapter';
import * as fs from 'fs';
import * as path from 'path';
import * as jsonschema from 'jsonschema';
import * as os from 'os';

export function getProjectConfig(options: { cwd?: string; context?: string }) {
  const config = getProjectConfigValue(options);

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

function getProjectConfigValue(options: { cwd?: string }) {
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
  while (!fs.existsSync(path.join(currentPath, 'schema.json'))) {
    currentPath = path.join(currentPath, '..');
  }

  return JSON.parse(fs.readFileSync(path.join(currentPath, 'schema.json')).toString());
}

function getGlobalConfigPath() {
  switch (process.platform) {
    case 'darwin':
      return path.join(os.homedir(), 'Library/Preferences/daita/cli.json');
    case 'win32':
      return path.join(os.homedir(), 'AppData/Roaming/daita/cli.json');
    default:
      return path.join(os.homedir(), '.config/daita/cli.json');
  }
}

export interface ConfigFile {
  auth: { token: string; username: string; issuer: string };
}

export function getGlobalConfig(): ConfigFile | null {
  const filepath = getGlobalConfigPath();
  if (!fs.existsSync(filepath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filepath).toString());
}

export function saveGlobalConfig(config: ConfigFile) {
  const filepath = getGlobalConfigPath();
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(path.dirname(filepath));
  }
  fs.writeFileSync(filepath, JSON.stringify(config, null, 2));
}
