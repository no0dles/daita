import { getProjectConfig } from './config';
import { HttpServerAuthorization } from '@daita/http-server';

export function getAuthorization(options: { cwd?: string; context?: string }): HttpServerAuthorization | false {
  const config = getProjectConfig(options);
  return config.authorization ? { rules: 'disabled', ...config.authorization } : false;
}
