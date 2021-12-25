import { Router } from 'express';
import { field } from '@daita/relational';
import { and } from '@daita/relational';
import { table } from '@daita/relational';
import { join } from '@daita/relational';
import { equal } from '@daita/relational';
import { isNull } from '@daita/relational';
import { TransactionContext } from '@daita/orm';
import { Counter } from 'prom-client';
import { metricRegister } from '../metric';
import { User, UserEmailVerify, UserPool } from '@daita/auth';

const invalidVerifyCounter = new Counter({
  name: 'auth_invalid_verify',
  help: 'failed verified user',
  registers: [metricRegister],
});
const successVerifyCounter = new Counter({
  name: 'auth_success_verify',
  help: 'verified user',
  registers: [metricRegister],
});

export function verifyRoute(ctx: TransactionContext<any>) {
  const router = Router({ mergeParams: true });

  router.get('/', async (req, res, next) => {
    try {
      const verify = await ctx.selectFirst({
        select: {
          username: field(UserEmailVerify, 'userUsername'),
          issuedAt: field(UserEmailVerify, 'issuedAt'),
          email: field(UserEmailVerify, 'email'),
          emailVerifyExpiresIn: field(UserPool, 'emailVerifyExpiresIn'),
        },
        from: table(UserEmailVerify),
        join: [
          join(User, equal(field(User, 'username'), field(UserEmailVerify, 'userUsername'))),
          join(UserPool, equal(field(UserPool, 'id'), field(User, 'userPoolId'))),
        ],
        where: and(equal(field(UserEmailVerify, 'code'), req.query.code), isNull(field(UserEmailVerify, 'verifiedAt'))),
      });

      if (!verify) {
        invalidVerifyCounter.inc();
        return res.status(400).json({ message: 'invalid code' });
      }

      await ctx.transaction(async (trx) => {
        await trx.update({
          update: table(UserEmailVerify),
          set: {
            verifiedAt: new Date(),
          },
          where: equal(field(UserEmailVerify, 'code'), req.query.code),
        });
        await trx.update({
          update: table(User),
          set: {
            emailVerified: true,
            email: verify.email,
          },
          where: equal(field(User, 'username'), verify.username),
        });
      });

      successVerifyCounter.inc();
      res.status(200).end();
    } catch (e) {
      next(e);
    }
  });

  return router;
}
