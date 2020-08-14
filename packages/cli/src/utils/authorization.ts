import { AppAuthorization } from '@daita/http-server-common';
import { getConfig } from './config';

export function getAuthorization(options: { cwd?: string, context?: string }): AppAuthorization | undefined {
  const config = getConfig(options);
  return config.authorization;
}
