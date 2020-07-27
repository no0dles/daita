import * as pg from '@daita/pg-adapter';
import { all, and, equal, field, getClient, table } from '@daita/relational';
import { UserPool } from './models/user-pool';
import { User } from './models/user';
import { getRandomCode } from './modules/random';
import { hashPassword } from './modules/hash';

//const adapter = new sqlite.SqliteRelationalAdapter(':memory:');
//pg.ensureDatabaseExists('postgres://postgres:postgres@localhost:5432/auth')
export const adapter = new pg.PostgresAdapter(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/auth');
export const client = getClient(adapter);

(async () => {
  console.log('seed');
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
        passwordRegex: '^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$',
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
})();
