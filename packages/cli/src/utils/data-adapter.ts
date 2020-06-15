import { RelationalTransactionAdapter } from '@daita/relational';
import { RelationalTransactionAdapterPackage } from '@daita/relational';

export interface DaitaContextConfig {
  module: string;
  connectionString?: string;
}

export async function getRelationalDataAdapter(
  options: any
): Promise<RelationalTransactionAdapter> {

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
