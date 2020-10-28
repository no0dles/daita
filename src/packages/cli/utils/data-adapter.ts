import { getProjectConfig } from './config';
import { AppAuthorization } from '../../http-server-common';
import { getClient, TransactionClient } from '../../relational/client';

export interface DaitaContextConfig {
  module: string;
  moduleOptions?: any;
  schemaLocation: string;
  schemaName?: string;
  migrationLocation?: string;
  authorization: AppAuthorization | false;
}

export async function getClientFromConfig(options: any): Promise<TransactionClient<any>> {
  const contextConfig = getProjectConfig(options);
  const pkg: any = require(contextConfig.module);
  return getClient(pkg.adapter, contextConfig.moduleOptions);
}
