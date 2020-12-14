import { UserPool } from '../../packages/auth-server/models/user-pool';
import { User } from '../../packages/auth-server/models/user';
import { getRandomCode } from '../../packages/auth-server/modules/random';
import { hashPassword } from '../../packages/auth-server/modules/hash';
import { field } from '../../packages/relational/sql/keyword/field/field';
import { and } from '../../packages/relational/sql/keyword/and/and';
import { Client } from '../../packages/relational/client/client';
import { all } from '../../packages/relational/sql/keyword/all/all';
import { table } from '../../packages/relational/sql/keyword/table/table';
import { equal } from '../../packages/relational/sql/operands/comparison/equal/equal';
import { createLogger } from '../../packages/common/utils/logger';
import { UserPoolUser } from '../../packages/auth-server/models/user-pool-user';

export async function seedAuthDefaults(client: Client<any>) {
  const logger = createLogger({ container: 'auth-pg', task: 'seed' });
  const adminPool = await client.selectFirst({
    select: all(UserPool),
    from: table(UserPool),
    where: equal(field(UserPool, 'id'), 'admin'),
  });

  if (!adminPool) {
    await client.insert({
      into: table(UserPool),
      insert: {
        id: 'admin',
        name: 'Administration',
        algorithm: 'ES512',
        emailVerifyExpiresIn: 60 * 60 * 1000,
        checkPasswordForBreach: true,
        accessTokenExpiresIn: 60 * 10,
        refreshRefreshExpiresIn: 60 * 60,
        passwordRegex: '^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$',
      },
    });
  }

  const adminUser = await client.selectFirst({
    select: all(User),
    from: table(User),
    where: and(equal(field(User, 'username'), 'admin'), equal(field(User, 'userPoolId'), 'admin')),
  });
  if (!adminUser) {
    const password = (await getRandomCode()).substr(0, 14);
    await client.insert({
      into: table(User),
      insert: {
        username: 'admin',
        userPoolId: 'admin',
        disabled: false,
        password: await hashPassword(password),
      },
    });
    await client.insert({
      into: table(UserPoolUser),
      insert: {
        userPoolId: 'admin',
        userUsername: 'admin',
      },
    });
    logger.info(`created admin user with password \"${password}\"`);
  }
}
