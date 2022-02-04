import { getRandomCode, hashPassword } from '@daita/auth-server';
import { createLogger } from '@daita/common';
import { seedPoolUser, seedUserPool } from '@daita/auth-server';
import { and, equal, field, RelationalAdapter, table } from '@daita/relational';
import { UserPoolUser } from '@daita/auth';

export async function seedAuthDefaults(client: RelationalAdapter<any>) {
  const logger = createLogger({ container: 'auth-pg', task: 'seed' });

  const hasAdmin = await client.selectFirst({
    select: field(UserPoolUser, 'userUsername'),
    from: table(UserPoolUser),
    where: and(equal(field(UserPoolUser, 'userPoolId'), 'admin'), equal(field(UserPoolUser, 'userUsername'), 'admin')),
  });

  if (hasAdmin) {
    return;
  }

  const password = (await getRandomCode()).substr(0, 14);
  const hashedPassword = await hashPassword(password);

  client.transaction((trx) => {
    seedUserPool(trx, {
      id: 'admin',
      name: 'Administration',
      algorithm: 'ES512',
      emailVerifyExpiresIn: 60 * 60 * 1000,
      checkPasswordForBreach: true,
      accessTokenExpiresIn: 60 * 10,
      refreshRefreshExpiresIn: 60 * 60,
      passwordRegex: '^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$',
    });
    seedPoolUser(client, {
      username: 'admin',
      userPoolId: 'admin',
      password: hashedPassword,
      disabled: false,
      email: '',
      emailVerified: false,
      phone: '',
      phoneVerified: false,
    });
  });

  logger.info(`created admin user pool`);
  logger.info(`created admin user with password "${password}"`);
}
