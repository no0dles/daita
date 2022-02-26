import { ExcludeNonPrimitive } from '@daita/common';
import { randomString } from '@daita/common';
import { field, isNotIn, RelationalTransactionAdapter } from '@daita/relational';
import { table } from '@daita/relational';
import { equal } from '@daita/relational';
import { getSha1 } from './modules/hash';
import { and } from '@daita/relational';
import { getRandomCode } from './modules/random';
import { Role, User, UserPool, UserPoolCors, UserPoolUser, UserRole, UserToken } from '@daita/auth';

export async function createToken(
  client: RelationalTransactionAdapter<any>,
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

export function seedRoles(client: RelationalTransactionAdapter<any>, role: ExcludeNonPrimitive<Role>) {
  client.insert({
    into: table(Role),
    insert: role,
    onConflict: {
      forField: ['name', 'userPoolId'],
      do: 'nothing',
    },
  });
}

export async function seedUserRole(client: RelationalTransactionAdapter<any>, userRole: ExcludeNonPrimitive<UserRole>) {
  await client.insert({
    insert: userRole,
    into: table(UserRole),
    onConflict: {
      forField: ['roleName', 'roleUserPoolId', 'userUsername'],
      do: 'nothing',
    },
  });
}

export function seedUserPool(client: RelationalTransactionAdapter<any>, userPool: ExcludeNonPrimitive<UserPool>): void {
  client.insert({
    insert: userPool,
    into: table(UserPool),
    onConflict: {
      forField: ['id'],
      do: 'nothing',
    },
  });
}

export function seedPoolUser(client: RelationalTransactionAdapter<any>, user: ExcludeNonPrimitive<User>): void {
  client.insert({
    into: table(User),
    insert: {
      username: user.username,
      userPoolId: user.userPoolId,
      disabled: user.disabled ?? false,
      email: user.email,
      emailVerified: user.emailVerified || true,
      password: user.password,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
    },
    onConflict: {
      forField: ['username'],
      do: 'nothing',
    },
  });
  client.insert({
    into: table(UserPoolUser),
    insert: {
      userPoolId: user.userPoolId,
      userUsername: user.username,
    },
    onConflict: {
      forField: ['userUsername', 'userPoolId'],
      do: 'nothing',
    },
  });
}

export async function seedUserPoolCors(client: RelationalTransactionAdapter<any>, userPoolId: string, cors: string[]) {
  client.delete({
    delete: table(UserPoolCors),
    where: and(isNotIn(field(UserPoolCors, 'url'), cors), equal(field(UserPoolCors, 'userPoolId'), userPoolId)),
  });
  client.insert({
    insert: cors.map((url) => ({ url, userPoolId, id: randomString(22) })),
    into: table(UserPoolCors),
    onConflict: {
      forField: 'url',
      do: 'nothing',
    },
  });
}
