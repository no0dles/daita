import {User} from './models/user';
import * as schema from './schema';
import {PostgresAdapter} from '@daita/pg';

const adapter = new PostgresAdapter("postgres://localhost/datam");
const context = schema.transactionContext(adapter);

//context.login('admin', 'admin');
context.transaction(async(trx) => {
  await trx.insert(User).value({
    firstName:  'bar',
    username: 'foo',
    email: 'test@test.com',
    lastName: null,
    password: '123',
  });

  const users = await trx.select(User)
    .where({ username: { $eq: 'pascal' }});

  console.log(users);
});

