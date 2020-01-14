import {User} from './models/user';
import * as schema from './schema';
import {PostgresDataAdapter} from "@daita/core/dist/postgres";

const adapter = new PostgresDataAdapter("postgres://localhost/datam");
const context = schema.context(adapter);

//context.login('admin', 'admin');
context.transaction(async(trx) => {
  await trx.insert(User).value({
    firstName:  'bar',
    username: 'foo',
    email: 'test@test.com',
    lastName: null,
    password: '123',
  }).exec();

  const users = await trx.select(User)
    .where({ username: { $eq: 'pascal' }})
    .exec();

  console.log(users);
});

