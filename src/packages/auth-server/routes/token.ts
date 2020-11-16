import * as express from 'express';
import { UserToken } from '../models/user-token';
import { authMiddleware } from '../middlewares/auth-middleware';
import { getRandomCode } from '../modules/random';
import { getSha1 } from '../modules/hash';
import { field } from '../../relational/sql/keyword/field/field';
import { and } from '../../relational/sql/keyword/and/and';
import { table } from '../../relational/sql/keyword/table/table';
import { equal } from '../../relational/sql/operands/comparison/equal/equal';
import { TransactionContext } from '../../orm/context/transaction-context';

export function tokenRoute(ctx: TransactionContext<any>) {
  const router = express.Router({ mergeParams: true });

  router.use(authMiddleware);
  router.get('/', async (req, res, next) => {
    try {
      const tokens = await ctx.select({
        select: {
          id: field(UserToken, 'id'),
          name: field(UserToken, 'name'),
          expiresAt: field(UserToken, 'expiresAt'),
          createdAt: field(UserToken, 'createdAt'),
        },
        from: table(UserToken),
        where: equal(field(UserToken, 'userUsername'), req.user?.sub!),
        limit: 20,
        offset: parseInt(req.query.skip as string, 0) || 0,
      });
      res.status(200).json(tokens);
    } catch (e) {
      next(e);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const token = await getRandomCode();
      const hashedToken = await getSha1(token);
      await ctx.insert({
        insert: {
          id: await getRandomCode(),
          userUsername: req.user?.sub!,
          token: hashedToken,
          name: req.body.name,
          expiresAt: req.body.expireAt || null,
          createdAt: new Date(),
        },
        into: table(UserToken),
      });

      res.status(200).json({
        token: `${req.params.userPoolId}:${token}`,
      });
    } catch (e) {
      next(e);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const result = await ctx.delete({
        delete: table(UserToken),
        where: and(
          equal(field(UserToken, 'id'), req.params.id),
          equal(field(UserToken, 'userUsername'), req.user?.sub!),
        ),
      });

      if (result.deletedRows === 1) {
        res.status(200).end();
      } else {
        res.status(404).end();
      }
    } catch (e) {
      next(e);
    }
  });

  return router;
}
