import { TransactionClient } from '../relational/client';
import { UserPool } from './models/user-pool';
import { all, equal, field, table } from '../relational/sql/function';
import { ExcludeNonPrimitive } from '../common/types';
import { UserPoolCors } from './models/user-pool-cors';

export async function seedUserPool(
  client: TransactionClient<any>,
  userPool: ExcludeNonPrimitive<UserPool>,
) {
  const existingUserPool = await client.selectFirst({
    select: all(UserPool),
    from: table(UserPool),
    where: equal(field(UserPool, 'id'), userPool.id),
  });
  if (!existingUserPool) {
    await client.insert({
      insert: userPool,
      into: table(UserPool),
    });
  }
}

export async function seedUserPoolCors(
  client: TransactionClient<any>,
  userPoolCors: ExcludeNonPrimitive<UserPoolCors>,
) {
  const existingUserPool = await client.selectFirst({
    select: all(UserPoolCors),
    from: table(UserPoolCors),
    where: equal(field(UserPoolCors, 'id'), userPoolCors.id),
  });
  if (!existingUserPool) {
    await client.insert({
      insert: userPoolCors,
      into: table(UserPoolCors),
    });
  } else if (existingUserPool.url !== userPoolCors.url) {
    await client.update({
      update: table(UserPoolCors),
      set: {
        url: userPoolCors.url,
      },
      where: equal(field(UserPoolCors, 'id'), userPoolCors.id),
    });
  }
}
