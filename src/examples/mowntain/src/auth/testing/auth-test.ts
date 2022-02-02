import { ExcludeNonPrimitive } from '@daita/common';
import { httpPost, HttpServerApp } from '@daita/testing';
import { InsertSql, RelationalTransactionAdapter, table } from '@daita/relational';
import { User, UserPool, UserPoolUser } from '@daita/auth';
import { hashPassword } from '@daita/auth-server';

export function createUserPool(client: RelationalTransactionAdapter<InsertSql<any>>, userPool: UserPool) {
  client.insert({
    into: table(UserPool),
    insert: userPool,
  });
}

export function createUser(client: RelationalTransactionAdapter<InsertSql<any>>, user: ExcludeNonPrimitive<User>) {
  client.insert({
    into: table(User),
    insert: user,
  });
  client.insert({
    into: table(UserPoolUser),
    insert: {
      userPoolId: user.userPoolId,
      userUsername: user.username,
    },
  });
}
export function createDefaultUserPool(client: RelationalTransactionAdapter<InsertSql<any>>) {
  createUserPool(client, {
    id: 'default',
    algorithm: 'RS384',
    name: 'Default',
    allowRegistration: true,
    accessTokenExpiresIn: 3600,
    refreshRefreshExpiresIn: 3600,
    emailVerifyExpiresIn: 3600,
  });
}

export async function createDefaultUser(client: RelationalTransactionAdapter<InsertSql<any>>) {
  await createUser(client, {
    username: 'user',
    password: await hashPassword('123456'),
    disabled: false,
    email: 'user@example.com',
    emailVerified: true,
    userPoolId: 'default',
  });
}

export async function login(authApp: HttpServerApp, username: string, password: string) {
  const res = await httpPost(authApp, `/default/login`, {
    username,
    password,
  });
  if (res.statusCode !== 200) {
    throw new Error(`unable to login with ${username}:${password}`);
  }
  return res.body.access_token;
}

export function loginWithDefaultUser(authApp: HttpServerApp) {
  return login(authApp, 'user', '123456');
}
