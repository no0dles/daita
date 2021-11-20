import * as express from 'express';
import { User } from '../models/user';
import { UserEmailVerify } from '../models/user-email-verify';
import { getRandomCode } from '../modules/random';
import { authMiddleware } from '../middlewares/auth-middleware';
import { field } from '@daita/relational';
import { and } from '@daita/relational';
import { table } from '@daita/relational';
import { equal } from '@daita/relational';
import { TransactionContext } from '@daita/orm';
import { getRequiredRequestUserProp } from '@daita/http-server-common';

export function resendRoute(ctx: TransactionContext<any>) {
  const router = express.Router({ mergeParams: true });

  router.use(authMiddleware);
  router.post('/', async (req, res, next) => {
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
