import { getRandomCode } from '@daita/auth-server';
import { createLogger } from '@daita/common';
import { seedPoolUser, seedUserPool } from '@daita/auth-server';
import { TransactionClient } from '@daita/relational';
import { TransactionContext } from '@daita/orm';

export async function seedAuthDefaults(client: TransactionClient<any> | TransactionContext<any>) {
  const logger = createLogger({ container: 'auth-pg', task: 'seed' });

  const addedPool = await seedUserPool(client, {
    id: 'admin',
    name: 'Administration',
    algorithm: 'EC512',
    emailVerifyExpiresIn: 60 * 60 * 1000,
    checkPasswordForBreach: true,
    accessTokenExpiresIn: 60 * 10,
    refreshRefreshExpiresIn: 60 * 60,
    passwordRegex: '^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$',
  });
  if (addedPool) {
    logger.info(`created admin user pool`);
  }

  const password = (await getRandomCode()).substr(0, 14);
  const addedUser = await seedPoolUser(client, {
    username: 'admin',
    userPoolId: 'admin',
    password,
    disabled: false,
    email: '',
    emailVerified: false,
    phone: '',
    phoneVerified: false,
  });
  if (addedUser) {
    logger.info(`created admin user with password "${password}"`);
  }
}
