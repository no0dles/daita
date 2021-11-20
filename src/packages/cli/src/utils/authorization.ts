import { getProjectConfig } from './config';
import { HttpServerAuthorization } from '@daita/http-server-common/http-server-authorization';

export function getAuthorization(options: { cwd?: string; context?: string }): HttpServerAuthorization | false {
  const config = getProjectConfig(options);
  return config.authorization || false;
}
