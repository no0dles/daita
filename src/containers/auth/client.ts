import { getRandomCode } from '../../packages/auth-server/modules/random';
import { createLogger } from '../../packages/common/utils/logger';
import { seedPoolUser, seedUserPool } from '../../packages/auth-server/seed';
import { TransactionClient } from '../../packages/relational/client/transaction-client';

export async function seedAuthDefaults(client: TransactionClient<any>) {
  const logger = createLogger({ container: 'auth-pg', task: 'seed' });

  const addedPool = await seedUserPool(client, {
    id: 'admin',
    name: 'Administration',
    algorithm: 'ES512',
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
    logger.info(`created admin user with password \"${password}\"`);
  }
}
