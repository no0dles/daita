import supertest from 'supertest';
import { UserEmailVerify } from './models/user-email-verify';
import { UserRefreshToken } from './models/user-refresh-token';
import { Express } from 'express';
import { createAuthApp } from './app';
import { authSchema } from './schema';
import { createDefaultUserPool } from '../../testing/auth-test';
import { field } from '../relational/sql/function/field';
import { migrate } from '../orm/migration/migrate';
import { all } from '../relational/sql/function/all';
import { table } from '../relational/sql/function/table';
import { notEqual } from '../relational/sql/function/not-equal';
import { MigrationClient } from '../relational/client/migration-client';
import { getPostgresDb, PostgresDb } from '../../testing/postgres-test';
import { getClient } from '../relational/client/get-client';
import { adapter } from '../pg-adapter';

describe('app', () => {
  let app: Express;
  let client: MigrationClient<any>;
  let postgresDb: PostgresDb;

  beforeAll(async () => {
    postgresDb = await getPostgresDb().start();
    client = getClient(adapter, {
      connectionString: postgresDb.connectionString,
      createIfNotExists: true,
    });
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

    it('should create token', async (done) => {
      supertest(app)
        .post('/default/token')
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(200, async (err, res) => {
          if (err) {
            return done(err);
          }

          expect(res.body.token).not.toBeNull();
          expect(res.body.token).not.toBeUndefined();
          expect(res.body.token).toStartWith('default:');
          done();
        });
    });
  });

  it('should verify', async (done) => {
    const verify = await client.selectFirst({
      select: all(UserEmailVerify),
      from: table(UserEmailVerify),
    });
    supertest(app).get('/default/verify').query({ code: verify.code }).expect(200, done);
  });
});
