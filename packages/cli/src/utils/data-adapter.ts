import { Command } from '@oclif/command';
import { RelationalTransactionAdapter } from '@daita/relational';
import { RelationalTransactionAdapterPackage } from '@daita/relational';

export interface DaitaContextConfig {
  module: string;
  connectionString?: string;
}

export async function getRelationalDataAdapter(
  flags: { context: string | undefined, cwd: string | undefined },
  cmd: Command,
): Promise<RelationalTransactionAdapter> {

  const config = require('config');
  const contextName = flags.context || 'default';
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
