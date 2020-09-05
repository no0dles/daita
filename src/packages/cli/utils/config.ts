import { DaitaContextConfig } from './data-adapter';
import * as fs from 'fs';
import * as path from 'path';

export function getConfig(options: { cwd?: string; context?: string }) {
  const configPath = path.join(options?.cwd || process.cwd(), 'daita.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing daita.json configuration, try "npx daita init"`);
  }

  const config = require(configPath);
  const contextName = options.context || 'default';
  if (!config || !config.context || !config.context[contextName]) {
    throw new Error(`Missing daita context ${contextName} configuration`);
  }

  //TODO parse and check config props

  return config.context[contextName] as DaitaContextConfig;
}
