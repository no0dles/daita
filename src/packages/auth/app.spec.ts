import * as supertest from 'supertest';
import { UserEmailVerify } from './models/user-email-verify';
import { UserRefreshToken } from './models/user-refresh-token';
import { all, field, notEqual, table } from '../relational/sql/function';
import { Express } from 'express';
import { createAuthApp } from './app';
import { migrate } from '../orm/migration';
import { authSchema } from './schema';
import { clientTest } from '../../testing/client-test';
import { createDefaultUserPool } from '../../testing/auth-test';

describe(
  'app',
  clientTest((client) => {
    let app: Express;

    beforeAll(async () => {
      app = createAuthApp(client);
      await migrate(client, authSchema);
      await createDefaultUserPool(client);
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
  }),
);
