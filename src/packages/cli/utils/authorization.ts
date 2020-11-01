import { getProjectConfig } from './config';
import { AppAuthorization } from '../../http-server-common/app-authorization';

export function getAuthorization(options: { cwd?: string; context?: string }): AppAuthorization | false {
  const config = getProjectConfig(options);
  return config.authorization || false;
}
