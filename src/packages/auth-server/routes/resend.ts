import * as express from 'express';
import { User } from '../models/user';
import { UserEmailVerify } from '../models/user-email-verify';
import { getRandomCode } from '../modules/random';
import { authMiddleware } from '../middlewares/auth-middleware';
import { field } from '../../relational/sql/keyword/field/field';
import { and } from '../../relational/sql/keyword/and/and';
import { table } from '../../relational/sql/keyword/table/table';
import { equal } from '../../relational/sql/operands/comparison/equal/equal';
import { TransactionContext } from '../../orm';

export function resendRoute(ctx: TransactionContext<any>) {
  const router = express.Router({ mergeParams: true });

  router.use(authMiddleware);
  router.post('/', async (req, res, next) => {
    try {
      const user = await ctx.selectFirst({
        select: {
          username: field(User, 'username'),
          email: field(User, 'email'),
          emailVerified: field(User, 'emailVerified'),
        },
        from: table(User),
        where: and(
          equal(field(User, 'username'), req?.user?.sub || ''),
          equal(field(User, 'userPoolId'), req.params.userPoolId),
        ),
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
