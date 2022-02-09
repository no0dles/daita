import { allow, authorized, now } from '@daita/relational';
import { createTestHttpServer, HttpTest, sqliteTestAdapter } from '@daita/testing';

describe('http-server/app', () => {
  let test: HttpTest;

  const adapter = sqliteTestAdapter.getRelationalAdapter({
    type: 'memory',
  });

  beforeAll(async () => {
    test = await createTestHttpServer(adapter, {
      rules: [
        {
          id: 'test',
          rule: allow(authorized(), {
            select: now(),
          }),
        },
      ],
    });
  });

  afterAll(async () => {
    await test.close();
    await adapter.close();
  });

  it('should login', async () => {
    const res = await test.http.json({
      path: `/test/login`,
      data: {
        username: 'user',
        password: '123456',
      },
    });
    expect(res.statusCode).toEqual(200);
    expect(res.data).not.toBeNull();
    expect(res.data).not.toBeUndefined();
    expect(res.data.token_type).toEqual('bearer');
  });

  it('should handle malformed bearer token', async () => {
    const res = await test.http.json({
      headers: { Authorization: 'Bearer asd' },
      path: '/api/relational/exec',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.data).toEqual({ message: 'invalid token format' });
  });

  it('should login with token', async () => {
    const res = await test.authorized('test').json({
      path: '/api/relational/exec',
      authorized: true,
      data: {
        sql: {
          select: now(),
        },
      },
    });
    expect(res.statusCode).toEqual(200);
    expect(res.data.rowCount).toEqual(1);
    expect(res.data.rows[0]).not.toBeUndefined();
  });

  // it('should return result', async () => {
  //   const res = await test.authorized('test').json({
  //     path: '/api/relational/exec',
  //     data: {
  //       sql: {
  //         select: now(),
  //       },
  //     },
  //   });
  //
  //   token = await loginWithDefaultUser(authServerTest.authHttp);
  //   const res = await httpPost(
  //     test.http,
  //     '/api/relational/exec',
  //     {
  //       sql: {
  //         select: now(),
  //       },
  //     },
  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     },
  //   );
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body.rowCount).toEqual(1);
  //   expect(res.body.rows[0]).not.toBeUndefined();
  // });

  it('should not allow undefined sql', async () => {
    const res = await test.authorized('test').json({
      path: '/api/relational/exec',
      data: {
        sql: {
          select: { time: now() },
        },
      },
    });
    expect(res.statusCode).toEqual(403);
  });

  it('should not allow unauthorized result', async () => {
    const res = await test.http.json({
      path: '/api/relational/exec',
      data: {
        sql: {
          select: now(),
        },
      },
    });
    expect(res.statusCode).toEqual(403);
  });
});
