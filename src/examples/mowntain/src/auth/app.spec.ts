import { field } from '@daita/relational';
import { all } from '@daita/relational';
import { table } from '@daita/relational';
import { notEqual } from '@daita/relational';
import { equal } from '@daita/relational';
import { AuthTest, sqliteTestAdapter } from '@daita/testing';
import { User, UserEmailVerify, UserRefreshToken } from '@daita/auth';
import { isDefined } from '@daita/common';
import { createTestAuthServer } from '@daita/testing';

describe('app', () => {
  const adapter = sqliteTestAdapter.getRelationalAdapter({
    type: 'memory',
  });
  let test: AuthTest;

  beforeAll(async () => {
    test = await createTestAuthServer(adapter, {});
  });

  afterAll(async () => {
    await test.close();
    await adapter.close();
  });

  it('should register', async () => {
    const res = await test.http.json({
      path: '/test/register',
      data: {
        password: '123456',
        username: 'foo',
        email: 'foo@example.com',
      },
    });
    expect(res.statusCode).toEqual(200);
  });

  it('should login', async () => {
    const res = await test.http.json({
      path: '/test/login',
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
    const token = await adapter.selectFirst({
      select: all(UserRefreshToken),
      from: table(UserRefreshToken),
    });
    isDefined(token);
    const res = await test.http.json({
      path: '/test/refresh',
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
      const res = await test.http.json({
        path: '/test/login',
        data: {
          password: '123456',
          username: 'foo',
        },
      });
      expect(res.statusCode).toEqual(200);
      accessToken = res.data.access_token;
    });

    it('should resend', async () => {
      const firstVerify = await adapter.selectFirst({
        select: all(UserEmailVerify),
        from: table(UserEmailVerify),
      });
      isDefined(firstVerify);

      const res = await test.http.json({
        path: '/test/resend',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          password: '123456',
          username: 'foo',
        },
      });
      expect(res.statusCode).toEqual(200);

      const secondVerify = await adapter.selectFirst({
        select: all(UserEmailVerify),
        from: table(UserEmailVerify),
        where: notEqual(field(UserEmailVerify, 'code'), firstVerify.code),
      });

      isDefined(secondVerify);
      expect(firstVerify.code).not.toBe(secondVerify.code);
      expect(firstVerify.email).toBe(secondVerify.email);
      expect(firstVerify.userUsername).toBe(secondVerify.userUsername);
    });

    it('should create token', async () => {
      const res = await test.http.json({
        path: '/test/token',
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
      expect(res.data.token).toContain('test:');
    });
  });

  it('should verify', async () => {
    const verify = await adapter.selectFirst({
      select: all(UserEmailVerify),
      from: table(UserEmailVerify),
    });
    isDefined(verify);
    const res = await test.http.get({
      path: '/test/verify',
      query: {
        code: verify.code,
      },
    });
    expect(res.statusCode).toEqual(200);

    const verifyEmail = await adapter.selectFirst({
      select: all(UserEmailVerify),
      from: table(UserEmailVerify),
      where: equal(field(UserEmailVerify, 'code'), verify.code),
    });
    isDefined(verifyEmail);
    expect(verifyEmail.verifiedAt).not.toBeNull();
    expect(verifyEmail.verifiedAt).not.toBeUndefined();

    const user = await adapter.selectFirst({
      select: all(User),
      from: table(User),
    });
    isDefined(user);
    expect(user.emailVerified).toBeTruthy();
  });

  // it('should get metrics', async () => {
  //   const res = await metricsHttp.get<string>({
  //     path: '/',
  //   });
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.data).not.toBeNull();
  //
  //   const lines = res.data.split('\n');
  //   const registrations = lines.find((l) => l.startsWith('auth_success_registrations'));
  //   isDefined(registrations);
  //   expect(parseInt(registrations.split(' ')[1])).toBeGreaterThan(0);
  // });
});
