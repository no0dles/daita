import { getProjectConfig } from './config';
import { AppAuthorization } from '../../http-server-common';

export function getAuthorization(options: { cwd?: string; context?: string }): AppAuthorization | false {
  const config = getProjectConfig(options);
  return config.authorization;
}
