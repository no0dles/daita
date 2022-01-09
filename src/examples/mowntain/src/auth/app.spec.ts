import { field } from '@daita/relational';
import { all } from '@daita/relational';
import { table } from '@daita/relational';
import { notEqual } from '@daita/relational';
import { MigrationContext } from '@daita/orm';
import { getContext } from '@daita/orm';
import { equal } from '@daita/relational';
import { getServer, HttpServerApp } from '@daita/testing';
import { adapter } from '@daita/sqlite-adapter';
import { createDefaultUserPool } from './testing/auth-test';
import { authSchema, User, UserEmailVerify, UserRefreshToken } from '@daita/auth';
import { NodeHttp } from '@daita/node';
import { createAuthApp, createMetricsApp } from '@daita/auth-server';

describe('app', () => {
  let app: HttpServerApp;
  let metricsApp: HttpServerApp;
  let ctx: MigrationContext<any>;
  let http: NodeHttp;
  let metricsHttp: NodeHttp;

  beforeAll(async () => {
    ctx = getContext(adapter, {
      schema: authSchema,
      memory: true,
    });
    app = getServer((port) => createAuthApp(ctx, port));
    metricsApp = getServer((port) => createMetricsApp(port));
    http = new NodeHttp(`http://localhost:${app.port}`, null);
    metricsHttp = new NodeHttp(`http://localhost:${metricsApp.port}`, null);
    await app.start();
    await metricsApp.start();
    await ctx.migrate();
    await createDefaultUserPool(ctx);
  });

  afterAll(async () => {
    await app?.close();
    await ctx.close();
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
        refreshToken: token!.token,
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
        where: notEqual(field(UserEmailVerify, 'code'), firstVerify!.code),
      });

      expect(firstVerify!.code).not.toBe(secondVerify!.code);
      expect(firstVerify!.email).toBe(secondVerify!.email);
      expect(firstVerify!.userUsername).toBe(secondVerify!.userUsername);
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
      expect(res.data.token).toContain('default:');
    });
  });

  it('should verify', async () => {
    const verify = await ctx.selectFirst({
      select: all(UserEmailVerify),
      from: table(UserEmailVerify),
    });
    const res = await http.get({
      path: '/default/verify',
      query: {
        code: verify!.code,
      },
    });
    expect(res.statusCode).toEqual(200);

    const verifyEmail = await ctx.selectFirst({
      select: all(UserEmailVerify),
      from: table(UserEmailVerify),
      where: equal(field(UserEmailVerify, 'code'), verify!.code),
    });
    expect(verifyEmail!.verifiedAt).not.toBeNull();
    expect(verifyEmail!.verifiedAt).not.toBeUndefined();

    const user = await ctx.selectFirst({
      select: all(User),
      from: table(User),
    });
    expect(user!.emailVerified).toBeTruthy();
  });

  it('should get metrics', async () => {
    const res = await metricsHttp.get<string>({
      path: '/',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.data).not.toBeNull();

    const lines = res.data.split('\n');
    const registrations = lines.find((l) => l.startsWith('auth_success_registrations'));
    expect(registrations).not.toBeUndefined();
    expect(parseInt(registrations!.split(' ')[1])).toBeGreaterThan(0);
  });
});