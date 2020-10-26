import { getConfig } from './config';
import { AppAuthorization } from '../../http-server-common';

export function getAuthorization(options: { cwd?: string; context?: string }): AppAuthorization | false {
  const config = getConfig(options);
  return config.authorization;
}
