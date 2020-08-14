import { RelationalTransactionAdapter } from '@daita/relational';
import { RelationalTransactionAdapterPackage } from '@daita/relational';
import { getConfig } from './config';
import { AppAuthorization } from '@daita/http-server-common';

export interface DaitaContextConfig {
  module: string;
  connectionString?: string;
  authorization?: AppAuthorization
}

export async function getRelationalDataAdapter(
  options: any
): Promise<RelationalTransactionAdapter> {
  const contextConfig = getConfig(options);
  const pkg: RelationalTransactionAdapterPackage = require(contextConfig.module);
  const adapter = await pkg.adapterFactory.createTransactionAdapter({
    createIfNotExists: true,
    connectionString: contextConfig.connectionString,
  });
  return adapter;
}
