import { RelationalTransactionAdapter } from '@daita/relational';
import { RelationalTransactionAdapterPackage } from '@daita/relational';
import * as path from "path";

export interface DaitaContextConfig {
  module: string;
  connectionString?: string;
}

export async function getRelationalDataAdapter(
  options: any
): Promise<RelationalTransactionAdapter> {
  process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';
  if (options.cwd) {
    process.env.NODE_CONFIG_DIR = path.join(options.cwd, 'config');
  }

  const config = require('config');
  const contextName = options.context || 'default';
  if (!config.has(`daita.context.${contextName}`)) {
    throw new Error('Missing daita context configuration');
  }

  const contextConfig = config.get(`daita.context.${contextName}`) as DaitaContextConfig;
  const pkg: RelationalTransactionAdapterPackage = require(contextConfig.module);
  const adapter = await pkg.adapterFactory.createTransactionAdapter({
    createIfNotExists: true,
    connectionString: contextConfig.connectionString,
  });
  return adapter;
}
