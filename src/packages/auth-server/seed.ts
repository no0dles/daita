import { UserPool } from './models/user-pool';
import { ExcludeNonPrimitive } from '../common/types/exclude-non-primitive';
import { UserPoolCors } from './models/user-pool-cors';
import { randomString } from '../common/utils/random-string';
import { field } from '../relational/sql/keyword/field/field';
import { TransactionClient } from '../relational/client/transaction-client';
import { all } from '../relational/sql/keyword/all/all';
import { table } from '../relational/sql/keyword/table/table';
import { equal } from '../relational/sql/operands/comparison/equal/equal';
import { User } from './models/user';
import { getSha1, hashPassword } from './modules/hash';
import { UserPoolUser } from './models/user-pool-user';
import { and } from '../relational/sql/keyword/and/and';
import { getRandomCode } from './modules/random';
import { UserToken } from './models/user-token';
import { UserRole } from './models/user-role';
import { Role } from './models/role';

export async function createToken(
  client: TransactionClient<any>,
  options: { userPoolId: string; username: string; name: string; expiresAt?: Date },
) {
  const token = await getRandomCode();
  const hashedToken = await getSha1(token);
  if (options.expiresAt) {
    await client.insert({
      insert: {
        id: await getRandomCode(),
        userUsername: options.username,
        token: hashedToken,
        name: options.name,
        expiresAt: options.expiresAt,
        createdAt: new Date(),
      },
      into: table(UserToken),
    });
  } else {
    await client.insert({
      insert: {
        id: await getRandomCode(),
        userUsername: options.username,
        token: hashedToken,
        name: options.name,
        createdAt: new Date(),
      },
      into: table(UserToken),
    });
  }

  return `${options.userPoolId}:${token}`;
}

export async function seedRoles(client: TransactionClient<any>, role: ExcludeNonPrimitive<Role>) {
  const existingRole = await client.selectFirst({
    select: all(Role),
    from: table(Role),
    where: and(equal(field(Role, 'name'), role.name), equal(field(Role, 'userPoolId'), role.userPoolId)),
  });
  if (existingRole) {
    return false;
  }
  await client.insert({
    into: table(Role),
    insert: role,
  });
  return true;
}

export async function seedUserRole(client: TransactionClient<any>, userRole: ExcludeNonPrimitive<UserRole>) {
  const existingUserRole = await client.selectFirst({
    select: all(UserRole),
    from: table(UserRole),
    where: and(
      equal(field(UserRole, 'roleName'), userRole.roleName),
      equal(field(UserRole, 'roleUserPoolId'), userRole.roleUserPoolId),
      equal(field(UserRole, 'userUsername'), userRole.userUsername),
    ),
  });
  if (existingUserRole) {
    return false;
  }

  await client.insert({
    insert: userRole,
    into: table(UserRole),
  });
}

export async function seedUserPool(
  client: TransactionClient<any>,
  userPool: ExcludeNonPrimitive<UserPool>,
): Promise<boolean> {
  const existingUserPool = await client.selectFirst({
    select: all(UserPool),
    from: table(UserPool),
    where: equal(field(UserPool, 'id'), userPool.id),
  });
  if (existingUserPool) {
    return false;
  }

  await client.insert({
    insert: userPool,
    into: table(UserPool),
  });
  return true;
}

export async function seedPoolUser(client: TransactionClient<any>, user: ExcludeNonPrimitive<User>): Promise<boolean> {
  const existingUser = await client.selectFirst({
    select: all(User),
    from: table(User),
    where: and(equal(field(User, 'username'), user.username), equal(field(User, 'userPoolId'), user.userPoolId)),
  });
  if (existingUser) {
    return false;
  }

  await client.insert({
    into: table(User),
    insert: {
      username: user.username,
      userPoolId: user.userPoolId,
      disabled: user.disabled ?? false,
      email: user.email,
      emailVerified: user.emailVerified || true,
      password: await hashPassword(user.password),
      phone: user.phone,
      phoneVerified: user.phoneVerified,
    },
  });
  await client.insert({
    into: table(UserPoolUser),
    insert: {
      userPoolId: user.userPoolId,
      userUsername: user.username,
    },
  });
  return true;
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
