import { Router } from 'express';
import { getRandomCode } from '../modules/random';
import { getAccessToken } from '../modules/key';
import { field } from '@daita/relational';
import { and } from '@daita/relational';
import { table } from '@daita/relational';
import { join } from '@daita/relational';
import { equal } from '@daita/relational';
import { getRoles } from '../modules/roles';
import { TransactionContext } from '@daita/orm';
import { Counter } from 'prom-client';
import { metricRegister } from '../metric';
import { User, UserPool, UserPoolAlgorithm, UserRefreshToken } from '@daita/auth';

const successRefreshTokenCounter = new Counter({
  name: 'auth_success_refresh_token',
  help: 'refresh jwt token',
  registers: [metricRegister],
});
const invalidRefreshTokenCounter = new Counter({
  name: 'auth_invalid_refresh_token',
  help: 'refresh jwt token',
  registers: [metricRegister],
});

export function refreshRoute(ctx: TransactionContext<any>) {
  const router = Router({ mergeParams: true });

  router.post<{ userPoolId: string }>('/', async (req, res, next) => {
    try {
      const token = await ctx.selectFirst({
        select: {
          authorizedAt: field(UserRefreshToken, 'authorizedAt'),
          issuedAt: field(UserRefreshToken, 'issuedAt'),
          userUsername: field(UserRefreshToken, 'userUsername'),
          userPoolId: field(UserPool, 'id'),
          userPoolAlgorithm: field(UserPool, 'algorithm'),
          userPoolAccessTokenExpiresIn: field(UserPool, 'accessTokenExpiresIn'),
          refreshRefreshExpiresIn: field(UserPool, 'refreshRefreshExpiresIn'),
        },
        from: table(UserRefreshToken),
        join: [
          join(User, equal(field(User, 'username'), field(UserRefreshToken, 'userUsername'))),
          join(UserPool, equal(field(UserRefreshToken, 'userPoolId'), field(UserPool, 'id'))),
        ],
        where: and(
          equal(field(UserRefreshToken, 'token'), req.body.refreshToken),
          equal(field(UserPool, 'id'), req.params.userPoolId),
        ),
      });

      if (!token) {
        invalidRefreshTokenCounter.inc();
        return res.status(400).json({ message: 'invalid token' });
      }

      const expiresAt = Math.floor(token.issuedAt.getTime() / 1000) + token.refreshRefreshExpiresIn;
      const now = Math.floor(new Date().getTime() / 1000);
      if (now > expiresAt) {
        await ctx.delete({
          delete: table(UserRefreshToken),
          where: equal(field(UserRefreshToken, 'token'), req.body.refreshToken),
        });
        invalidRefreshTokenCounter.inc();
        return res.status(400).json({
          message: 'token expired',
        });
      }

      const roles = await getRoles(ctx, token.userPoolId, token.userUsername);

      const refreshToken = await getRandomCode();
      const accessToken = await getAccessToken(
        req.params.userPoolId,
        {
          roles,
        },
        {
          subject: token.userUsername,
          expiresIn: token.userPoolAccessTokenExpiresIn,
          issuer: token.userPoolId,
          algorithm: token.userPoolAlgorithm as UserPoolAlgorithm,
        },
      );

      await ctx.transaction(async (trx) => {
        await trx.delete({
          delete: table(UserRefreshToken),
          where: equal(field(UserRefreshToken, 'token'), req.body.refreshToken),
        });
        await trx.insert({
          into: table(UserRefreshToken),
          insert: {
            userUsername: token.userUsername,
            userPoolId: token.userPoolId,
            token: refreshToken,
            issuedAt: new Date(),
            authorizedAt: token.authorizedAt,
          },
        });
      });

      successRefreshTokenCounter.inc();
      return res.status(200).json({
        refresh_token: refreshToken,
        access_token: accessToken,
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
