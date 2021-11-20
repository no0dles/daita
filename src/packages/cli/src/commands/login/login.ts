import { cli } from 'cli-ux';
import { sendPost } from '../../utils/https';
import { saveGlobalConfig } from '../../utils/config';
import { createLogger } from '@daita/common';

const logger = createLogger({ package: 'cli', command: 'login' });
export async function login() {
  const username = await cli.prompt('Username', { required: true });
  const password = await cli.prompt('Password', { required: true, type: 'hide' });

  let accessToken: string | null;
  try {
    const login = await sendPost<{ access_token: string }>('auth.daita.ch', '/daita/login', {
      username,
      password,
    });
    logger.info('login successfull');
    accessToken = login.access_token;
  } catch (e) {
    logger.error(e);
    return;
  }

  const apiToken = await sendPost<{ token: string }>('auth.daita.ch', '/daita/token', null, {
    Authorization: `Bearer ${accessToken}`,
  });

  saveGlobalConfig({ auth: { token: apiToken.token, issuer: 'daita', username } });
  logger.info('saved credentials');
}
