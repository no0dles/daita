import { getConfig } from './config';
import { AppAuthorization } from '../../http-server-common';
import { getClient, TransactionClient } from '../../relational/client';

export interface DaitaContextConfig {
  module: string;
  moduleOptions?: string;
  authorization?: AppAuthorization;
}

export async function getClientFromConfig(
  options: any,
): Promise<TransactionClient<any>> {
  const contextConfig = getConfig(options);
  const pkg: any = require(contextConfig.module);
  return getClient(pkg.adapter, contextConfig.moduleOptions);
}
