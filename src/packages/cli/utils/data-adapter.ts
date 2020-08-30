import { getConfig } from './config';
import { AppAuthorization } from '../../http-server-common';
import {
  RelationalTransactionAdapter,
  RelationalTransactionAdapterPackage,
} from '../../relational/adapter';

export interface DaitaContextConfig {
  module: string;
  connectionString?: string;
  authorization?: AppAuthorization;
}

export async function getRelationalDataAdapter(
  options: any,
): Promise<RelationalTransactionAdapter> {
  const contextConfig = getConfig(options);
  const pkg: RelationalTransactionAdapterPackage = require(contextConfig.module);
  const adapter = await pkg.adapterFactory.createTransactionAdapter({
    createIfNotExists: true,
    connectionString: contextConfig.connectionString,
  });
  return adapter;
}
