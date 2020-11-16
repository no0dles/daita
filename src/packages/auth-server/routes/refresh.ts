import * as express from 'express';
import { UserRefreshToken } from '../models/user-refresh-token';
import { getRandomCode } from '../modules/random';
import { User } from '../models/user';
import { UserPool, UserPoolAlgorithm } from '../models/user-pool';
import { getAccessToken } from '../modules/key';
import { field } from '../../relational/sql/keyword/field/field';
import { and } from '../../relational/sql/keyword/and/and';
import { table } from '../../relational/sql/keyword/table/table';
import { join } from '../../relational/sql/dml/select/join/join';
import { equal } from '../../relational/sql/operands/comparison/equal/equal';
import { getRoles } from '../modules/roles';
import { TransactionContext } from '../../orm/context/transaction-context';

export function refreshRoute(ctx: TransactionContext<any>) {
  const router = express.Router({ mergeParams: true });

  router.post('/', async (req, res, next) => {
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
        return res.status(400).json({ message: 'invalid token' });
      }

      const expiresAt = Math.floor(token.issuedAt.getTime() / 1000) + token.refreshRefreshExpiresIn;
      const now = Math.floor(new Date().getTime() / 1000);
      if (now > expiresAt) {
        await ctx.delete({
          delete: table(UserRefreshToken),
          where: equal(field(UserRefreshToken, 'token'), req.body.refreshToken),
        });
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
