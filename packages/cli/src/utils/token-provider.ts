import {Command} from '@oclif/command';
import {TokenProvider} from '@daita/web/dist/auth/token-provider';
import {openIdTokenProvider} from '@daita/web/dist/auth/openid-token-provider';

interface DaitaAuthOpenIdConfig {
  type: 'openid';
  url: string;
  client_id: string;
  client_secret: string;
}

export function getTokenProvider(
  flags: { context: string | undefined, cwd: string | undefined },
  cmd: Command,
): TokenProvider | undefined {

  const config = require('config');
  const contextName = flags.context || 'default';
  if (!config.has(`daita.auth.${contextName}`)) {
    cmd.warn('No auth configuration');
    return undefined;
  }

  const authConfig = config.get(`daita.auth.${contextName}`) as DaitaAuthOpenIdConfig;
  return openIdTokenProvider({
    clientId: authConfig.client_id,
    clientSecret: authConfig.client_secret,
    uri: authConfig.url,
  });
}