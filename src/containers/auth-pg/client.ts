import { UserPool } from '../../packages/auth/models/user-pool';
import { User } from '../../packages/auth/models/user';
import { getRandomCode } from '../../packages/auth/modules/random';
import { hashPassword } from '../../packages/auth/modules/hash';
import {
  all,
  and,
  equal,
  field,
  table,
} from '../../packages/relational/sql/function';
import { Client } from '../../packages/relational/client';

export async function seedAuthDefaults(client: Client<any>) {
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
    where: and(
      equal(field(User, 'username'), 'admin'),
      equal(field(User, 'userPoolId'), 'admin'),
    ),
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
    console.log(`created admin user with password \"${password}\"`);
  }
}
