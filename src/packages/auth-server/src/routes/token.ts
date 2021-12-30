import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import { field } from '@daita/relational';
import { and } from '@daita/relational';
import { table } from '@daita/relational';
import { equal } from '@daita/relational';
import { TransactionContext } from '@daita/orm';
import { createToken } from '../seed';
import { getRequiredRequestUserProp } from '@daita/http-server';
import { UserToken } from '@daita/auth';

export function tokenRoute(ctx: TransactionContext<any>) {
  const router = Router({ mergeParams: true });

  router.use(authMiddleware);
  router.get<{ userPoolId: string }>('/', async (req, res, next) => {
    try {
      const tokens = await ctx.select({
        select: {
          id: field(UserToken, 'id'),
          name: field(UserToken, 'name'),
          expiresAt: field(UserToken, 'expiresAt'),
          createdAt: field(UserToken, 'createdAt'),
        },
        from: table(UserToken),
        where: equal(field(UserToken, 'userUsername'), getRequiredRequestUserProp(req, 'sub')),
        limit: 20,
        offset: parseInt(req.query.skip as string, 0) || 0,
      });
      res.status(200).json(tokens);
    } catch (e) {
      next(e);
    }
  });

  router.post<{ userPoolId: string }>('/', async (req, res, next) => {
    try {
      const token = await createToken(ctx, {
        username: getRequiredRequestUserProp(req, 'sub'),
        userPoolId: req.params.userPoolId,
        name: req.body.name,
        expiresAt: req.body.expireAt,
      });

      res.status(200).json({
        token,
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
          equal(field(UserToken, 'userUsername'), getRequiredRequestUserProp(req, 'sub')),
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
