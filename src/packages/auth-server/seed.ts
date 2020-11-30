import { UserPool } from './models/user-pool';
import { ExcludeNonPrimitive } from '../common/types/exclude-non-primitive';
import { UserPoolCors } from './models/user-pool-cors';
import { randomString } from '../common/utils/random-string';
import { field } from '../relational/sql/keyword/field/field';
import { TransactionClient } from '../relational/client/transaction-client';
import { all } from '../relational/sql/keyword/all/all';
import { table } from '../relational/sql/keyword/table/table';
import { equal } from '../relational/sql/operands/comparison/equal/equal';

export async function seedUserPool(client: TransactionClient<any>, userPool: ExcludeNonPrimitive<UserPool>) {
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

export async function seedUserPoolCors(client: TransactionClient<any>, userPoolId: string, cors: string[]) {
  const existingCors = await client.select({
    select: all(UserPoolCors),
    from: table(UserPoolCors),
    where: equal(field(UserPoolCors, 'userPoolId'), userPoolId),
  });
  for (const corsUrl of cors) {
    const existingCorsUrl = existingCors.find((c) => c.url === corsUrl);
    if (!existingCorsUrl) {
      await client.insert({
        insert: { url: corsUrl, userPoolId, id: randomString(22) },
        into: table(UserPoolCors),
      });
    } else {
      const index = existingCors.indexOf(existingCorsUrl);
      existingCors.splice(index, 1);
    }
  }
  for (const existingCorsUrl of existingCors) {
    await client.delete({
      delete: table(UserPoolCors),
      where: equal(field(UserPoolCors, 'id'), existingCorsUrl.id),
    });
  }
}
