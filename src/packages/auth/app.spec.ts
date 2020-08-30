import * as supertest from 'supertest';
import * as app from './app';
import { client } from './client';
import { UserPool } from './models/user-pool';
import { User } from './models/user';
import { UserEmailVerify } from './models/user-email-verify';
import { UserRefreshToken } from './models/user-refresh-token';
import { UserPoolCors } from './models/user-pool-cors';
import { all, equal, field, notEqual, table } from '../relational/sql/function';

describe('app', () => {
  beforeAll(async () => {
    await client.delete({
      delete: table(UserPoolCors),
    });
    await client.delete({
      delete: table(UserEmailVerify),
    });
    await client.delete({
      delete: table(UserRefreshToken),
    });
    await client.delete({
      delete: table(User),
    });
    await client.delete({
      delete: table(UserPool),
      where: equal(field(UserPool, 'id'), 'default'),
    });
    await client.insert({
      into: table(UserPool),
      insert: {
        id: 'default',
        algorithm: 'RS384',
        name: 'Default',
        allowRegistration: true,
        accessTokenExpiresIn: 3600,
        refreshRefreshExpiresIn: 3600,
        emailVerifyExpiresIn: 3600,
      },
    });
    await client.insert({
      into: table(UserPoolCors),
      insert: {
        userPoolId: 'default',
        url: 'http://localhost:3000',
        id: 'abc',
      },
    });
  });

  it('should register', (done) => {
    supertest(app)
      .post('/default/register')
      .send({
        password: '123456',
        username: 'foo',
        email: 'foo@example.com',
      })
      .expect(200, done);
  });

  it('should login', (done) => {
    supertest(app)
      .post('/default/login')
      .send({
        password: '123456',
        username: 'foo',
      })
      .expect(200, (err, res) => {
        expect(err).toBeNull();
        expect(res.body.token_type).toBe('bearer');
        expect(res.body.id_token).toBeDefined();
        expect(res.body.refresh_token).toBeDefined();
        expect(res.body.access_token).toBeDefined();
        expect(res.body.expires_in).toBe(3600);
        console.log(res.body.access_token);
        console.log(res.body.id_token);
        console.log(res.body.refresh_token);
        done();
      });
  });

  it('should refresh', async (done) => {
    const token = await client.selectFirst({
      select: all(UserRefreshToken),
      from: table(UserRefreshToken),
    });
    supertest(app)
      .post('/default/refresh')
      .send({
        refreshToken: token.token,
      })
      .expect(200, (err, res) => {
        expect(err).toBeNull();
        expect(res.body.access_token).toBeDefined();
        expect(res.body.refresh_token).toBeDefined();
        done();
      });
  });

  describe('resend', () => {
    let accessToken: string | undefined;

    beforeAll(async () => {
      accessToken = await new Promise((resolve) => {
        supertest(app)
          .post('/default/login')
          .send({
            password: '123456',
            username: 'foo',
          })
          .expect(200, (err, res) => {
            expect(err).toBeNull();
            resolve(res.body.access_token);
          });
      });
    });

    it('should resend', async (done) => {
      const firstVerify = await client.selectFirst({
        select: all(UserEmailVerify),
        from: table(UserEmailVerify),
      });

      supertest(app)
        .post('/default/resend')
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(200, async (err) => {
          if (err) {
            return done(err);
          }

          const secondVerify = await client.selectFirst({
            select: all(UserEmailVerify),
            from: table(UserEmailVerify),
            where: notEqual(field(UserEmailVerify, 'code'), firstVerify.code),
          });

          expect(firstVerify.code).not.toBe(secondVerify.code);
          expect(firstVerify.email).toBe(secondVerify.email);
          expect(firstVerify.userUsername).toBe(secondVerify.userUsername);

          done();
        });
    });
  });

  it('should verify', async (done) => {
    const verify = await client.selectFirst({
      select: all(UserEmailVerify),
      from: table(UserEmailVerify),
    });
    supertest(app)
      .get('/default/verify')
      .query({ code: verify.code })
      .expect(200, done);
  });
});
