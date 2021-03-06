import { UserPool } from '../packages/auth-server/models/user-pool';
import { User } from '../packages/auth-server/models/user';
import { ExcludeNonPrimitive } from '../packages/common/types/exclude-non-primitive';
import { hashPassword } from '../packages/auth-server/modules/hash';
import { httpPost, HttpServerApp } from '../packages/node/testing/http-server';
import { table } from '../packages/relational/sql/keyword/table/table';
import { UserPoolUser } from '../packages/auth-server/models/user-pool-user';
import { Client } from '../packages/relational/client/client';

export async function createUserPool(client: Client<any>, userPool: UserPool) {
  await client.insert({
    into: table(UserPool),
    insert: userPool,
  });
}

export async function createUser(client: Client<any>, user: ExcludeNonPrimitive<User>) {
  await client.insert({
    into: table(User),
    insert: user,
  });
  await client.insert({
    into: table(UserPoolUser),
    insert: {
      userPoolId: user.userPoolId,
      userUsername: user.username,
    },
  });
}
export async function createDefaultUserPool(client: Client<any>) {
  await createUserPool(client, {
    id: 'default',
    algorithm: 'RS384',
    name: 'Default',
    allowRegistration: true,
    accessTokenExpiresIn: 3600,
    refreshRefreshExpiresIn: 3600,
    emailVerifyExpiresIn: 3600,
  });
}

export async function createDefaultUser(client: Client<any>) {
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
