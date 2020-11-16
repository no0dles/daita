import { UserEmailVerify } from './models/user-email-verify';
import { UserRefreshToken } from './models/user-refresh-token';
import { createAuthApp } from './app';
import { authSchema } from './schema';
import { createDefaultUserPool } from '../../testing/auth-test';
import { field } from '../relational/sql/keyword/field/field';
import { all } from '../relational/sql/keyword/all/all';
import { table } from '../relational/sql/keyword/table/table';
import { notEqual } from '../relational/sql/operands/comparison/not-equal/not-equal';
import { adapter } from '../pg-adapter';
import { MigrationContext } from '../orm/context/get-migration-context';
import { getServer, HttpServerApp } from '../../testing/http-server';
import { User } from './models/user';
import { getPostgresDb, PostgresDb } from '../pg-adapter/testing/postgres-test-adapter';
import { getContext } from '../orm/context/get-context';
import { NodeHttp } from '../http-client-common/node-http';
import { equal } from '../relational/sql/operands/comparison/equal/equal';

describe('app', () => {
  let app: HttpServerApp;
  let ctx: MigrationContext<any>;
  let postgresDb: PostgresDb;
  let http: NodeHttp;

  beforeAll(async () => {
    postgresDb = await getPostgresDb();
    ctx = getContext(adapter, {
      schema: authSchema,
      connectionString: postgresDb.connectionString,
      createIfNotExists: true,
    });
    app = getServer((port) => createAuthApp(ctx, port));
    http = new NodeHttp(`http://localhost:${app.port}`, null);
    await app.start();
    await ctx.migrate();
    await createDefaultUserPool(ctx);
  });

  afterAll(async () => {
    await app?.close();
    await ctx.close();
    await postgresDb.close();
  });

  it('should register', async () => {
    const res = await http.json({
      path: '/default/register',
      data: {
        password: '123456',
        username: 'foo',
        email: 'foo@example.com',
      },
    });
    expect(res.statusCode).toEqual(200);
  });

  it('should login', async () => {
    const res = await http.json({
      path: '/default/login',
      data: {
        password: '123456',
        username: 'foo',
      },
    });
    expect(res.statusCode).toEqual(200);
    expect(res.data.token_type).toBe('bearer');
    expect(res.data.id_token).toBeDefined();
    expect(res.data.refresh_token).toBeDefined();
    expect(res.data.access_token).toBeDefined();
    expect(res.data.expires_in).toBe(3600);
  });

  it('should refresh', async () => {
    const token = await ctx.selectFirst({
      select: all(UserRefreshToken),
      from: table(UserRefreshToken),
    });
    const res = await http.json({
      path: '/default/refresh',
      data: {
        refreshToken: token.token,
      },
    });
    expect(res.statusCode).toEqual(200);
    expect(res.data.access_token).toBeDefined();
    expect(res.data.refresh_token).toBeDefined();
  });

  describe('resend', () => {
    let accessToken: string | undefined;

    beforeAll(async () => {
      const res = await http.json({
        path: '/default/login',
        data: {
          password: '123456',
          username: 'foo',
        },
      });
      expect(res.statusCode).toEqual(200);
      accessToken = res.data.access_token;
    });

    it('should resend', async () => {
      const firstVerify = await ctx.selectFirst({
        select: all(UserEmailVerify),
        from: table(UserEmailVerify),
      });

      const res = await http.json({
        path: '/default/resend',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          password: '123456',
          username: 'foo',
        },
      });
      expect(res.statusCode).toEqual(200);

      const secondVerify = await ctx.selectFirst({
        select: all(UserEmailVerify),
        from: table(UserEmailVerify),
        where: notEqual(field(UserEmailVerify, 'code'), firstVerify.code),
      });

      expect(firstVerify.code).not.toBe(secondVerify.code);
      expect(firstVerify.email).toBe(secondVerify.email);
      expect(firstVerify.userUsername).toBe(secondVerify.userUsername);
    });

    it('should create token', async () => {
      const res = await http.json({
        path: '/default/token',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          password: '123456',
          username: 'foo',
        },
      });
      expect(res.statusCode).toEqual(200);
      expect(res.data.token).not.toBeNull();
      expect(res.data.token).not.toBeUndefined();
      expect(res.data.token).toStartWith('default:');
    });
  });

  it('should verify', async () => {
    const verify = await ctx.selectFirst({
      select: all(UserEmailVerify),
      from: table(UserEmailVerify),
    });
    const res = await http.json({
      method: 'GET',
      path: '/default/verify',
      query: {
        code: verify.code,
      },
    });
    expect(res.statusCode).toEqual(200);

    const verifyEmail = await ctx.selectFirst({
      select: all(UserEmailVerify),
      from: table(UserEmailVerify),
      where: equal(field(UserEmailVerify, 'code'), verify.code),
    });
    expect(verifyEmail.verifiedAt).not.toBeNull();
    expect(verifyEmail.verifiedAt).not.toBeUndefined();

    const user = await ctx.selectFirst({
      select: all(User),
      from: table(User),
    });
    expect(user.emailVerified).toBeTrue();
  });
});
