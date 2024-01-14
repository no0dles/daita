import { Router } from 'express';
import { getRandomCode } from '../modules/random';
import { authMiddleware } from '../middlewares/auth-middleware';
import { field } from '@daita/relational';
import { and } from '@daita/relational';
import { table } from '@daita/relational';
import { equal } from '@daita/relational';
import { RelationalAdapter } from '@daita/relational';
import { getRequiredRequestUserProp } from '@daita/http-server';
import { User, UserEmailVerify } from '@daita/auth';

export function resendRoute(ctx: RelationalAdapter<any>):Router {
  const router = Router({ mergeParams: true });

  router.use(authMiddleware);
  router.post<{ userPoolId: string }>('/', async (req, res, next) => {
    try {
      const username = getRequiredRequestUserProp(req, 'sub');
      const user = await ctx.selectFirst({
        select: {
          username: field(User, 'username'),
          email: field(User, 'email'),
          emailVerified: field(User, 'emailVerified'),
        },
        from: table(User),
        where: and(equal(field(User, 'username'), username), equal(field(User, 'userPoolId'), req.params.userPoolId)),
      });

      if (!user) {
        return res.status(400).json({ message: 'invalid user' });
      }

      if (!user.email) {
        return res.status(400).json({ message: 'email not specified' });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: 'email already verified' });
      }

      await ctx.insert({
        into: table(UserEmailVerify),
        insert: {
          issuedAt: new Date(),
          userUsername: user.username,
          code: await getRandomCode(),
          email: user.email,
        },
      });

      res.status(200).end();
    } catch (e) {
      next(e);
    }
  });

  return router;
}
