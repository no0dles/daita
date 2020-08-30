import { getConfig } from './config';
import {AppAuthorization} from '../../http-server-common';

export function getAuthorization(options: { cwd?: string, context?: string }): AppAuthorization | undefined {
  const config = getConfig(options);
  return config.authorization;
}
