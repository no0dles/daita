import * as path from 'path';
import { DaitaContextConfig } from './data-adapter';

export function getConfig(options: { cwd?: string; context?: string }) {
  process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';
  if (options.cwd) {
    process.env.NODE_CONFIG_DIR = path.join(options.cwd, 'config');
  }

  const config = require('config');
  const contextName = options.context || 'default';
  if (!config.has(`daita.context.${contextName}`)) {
    throw new Error(`Missing daita context ${contextName} configuration`);
  }

  return config.get(`daita.context.${contextName}`) as DaitaContextConfig;
}
