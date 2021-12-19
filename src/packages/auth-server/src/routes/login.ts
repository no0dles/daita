import { Router } from 'express';
import { User } from '../models/user';
import { UserPool, UserPoolAlgorithm } from '../models/user-pool';
import { UserRefreshToken } from '../models/user-refresh-token';
import { compareHash } from '../modules/hash';
import { getAccessToken } from '../modules/key';
import { getRandomCode } from '../modules/random';
import { or } from '@daita/relational';
import { field } from '@daita/relational';
import { and } from '@daita/relational';
import { table } from '@daita/relational';
import { equal } from '@daita/relational';
import { join } from '@daita/relational';
import { UserPoolUser } from '../models/user-pool-user';
import { getRoles } from '../modules/roles';
import { TransactionContext } from '@daita/orm';
import { Counter } from 'prom-client';
import { metricRegister } from '../metric';

const invalidLoginCounter = new Counter({
  name: 'auth_invalid_login',
  help: 'invalid logins',
  registers: [metricRegister],
});

const successfullLoginCounter = new Counter({
  name: 'auth_success_login',
  help: 'successfull logins',
  registers: [metricRegister],
});

export function loginRoute(ctx: TransactionContext<any>) {
  const router = Router({ mergeParams: true });

  router.post('/', async (req, res, next) => {
    try {
      const user = await ctx!.selectFirst({
        select: {
          password: field(User, 'password'),
          username: field(User, 'username'),
          email: field(User, 'email'),
          emailVerified: field(User, 'emailVerified'),
          userPool: {
            id: field(UserPool, 'id'),
            accessTokenExpiresIn: field(UserPool, 'accessTokenExpiresIn'),
            algorithm: field(UserPool, 'algorithm'),
          },
        },
        from: table(User),
        join: [
          join(table(UserPoolUser), equal(field(UserPoolUser, 'userUsername'), field(User, 'username'))),
          join(table(UserPool), equal(field(UserPoolUser, 'userPoolId'), field(UserPool, 'id'))),
        ],
        where: and(
          or(equal(field(User, 'username'), req.body.username), equal(field(User, 'email'), req.body.username)),
          equal(field(UserPoolUser, 'userPoolId'), req.params.userPoolId),
        ),
      });

      if (!user) {
        invalidLoginCounter.inc();
        return res.status(400).json({ message: 'invalid credentials' });
      }

      const matchesHash = await compareHash(req.body.password, user.password);
      if (!matchesHash) {
        invalidLoginCounter.inc();
        return res.status(400).json({ message: 'invalid credentials' });
      }

      const roles = await getRoles(ctx, req.params.userPoolId, user.username);
      const refreshToken = await getRandomCode();
      const accessToken = await getAccessToken(
        req.params.userPoolId,
        {
          roles,
        },
        {
          subject: user.username,
          expiresIn: user.userPool.accessTokenExpiresIn,
          issuer: user.userPool.id,
          algorithm: user.userPool.algorithm as UserPoolAlgorithm,
        },
      );
      const idToken = await getAccessToken(
        req.params.userPoolId,
        {
          email: user.email,
          emailVerified: user.emailVerified,
        },
        {
          subject: user.username,
          expiresIn: user.userPool.accessTokenExpiresIn,
          issuer: user.userPool.id,
          algorithm: user.userPool.algorithm as UserPoolAlgorithm,
        },
      );

      await ctx.insert({
        insert: {
          userUsername: user.username,
          token: refreshToken,
          userPoolId: req.params.userPoolId,
          authorizedAt: new Date(),
          issuedAt: new Date(),
        },
        into: table(UserRefreshToken),
      });

      successfullLoginCounter.inc();
      res.status(200).json({
        refresh_token: refreshToken,
        access_token: accessToken,
        id_token: idToken,
        expires_in: user.userPool.accessTokenExpiresIn,
        token_type: 'bearer',
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
