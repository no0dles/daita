import { Router } from 'express';
import { hashPassword } from '../modules/hash';
import { getRandomCode } from '../modules/random';
import { getLeakedCount } from '../modules/password';
import { field } from '@daita/relational';
import { table } from '@daita/relational';
import { equal } from '@daita/relational';
import { TransactionContext } from '@daita/orm';
import { Counter } from 'prom-client';
import { metricRegister } from '../metric';
import { User, UserEmailVerify, UserPool, UserPoolUser } from '@daita/auth';

const successRegisterCounter = new Counter({
  name: 'auth_success_registrations',
  help: 'registered users',
  registers: [metricRegister],
});

export function registerRoute(ctx: TransactionContext<any>) {
  const router = Router({ mergeParams: true });

  router.post('/', async (req, res, next) => {
    try {
      const userPool = await ctx.selectFirst({
        select: {
          passwordRegex: field(UserPool, 'passwordRegex'),
          checkPasswordForBreach: field(UserPool, 'checkPasswordForBreach'),
          allowRegistration: field(UserPool, 'allowRegistration'),
        },
        from: table(UserPool),
        where: equal(field(UserPool, 'id'), req.params.userPoolId),
      });

      if (!userPool) {
        return res.status(400).json({ message: 'invalid user pool' });
      }

      if (!userPool.allowRegistration) {
        return res.status(400).json({ message: 'user pool does not allow registration' });
      }

      if (userPool.passwordRegex) {
        const regexp = new RegExp(userPool.passwordRegex);
        if (!regexp.test(req.body.password)) {
          return res.status(400).json({ message: 'password does not match password rules' });
        }
      }

      if (userPool.checkPasswordForBreach) {
        const leakedCount = await getLeakedCount(req.body.password);
        if (leakedCount > 0) {
          return res.status(400).json({ message: `password got leaked ${leakedCount} times` });
        }
      }

      const hash = await hashPassword(req.body.password);
      const emailVerifyCode = await getRandomCode();
      await ctx.transaction(async (trx) => {
        await trx.insert({
          insert: {
            userPoolId: req.params.userPoolId,
            username: req.body.username,
            password: hash,
            email: req.body.email,
            phone: req.body.phone,
            disabled: false,
            emailVerified: false,
            phoneVerified: false,
          },
          into: table(User),
        });
        await trx.insert({
          into: table(UserPoolUser),
          insert: {
            userUsername: req.body.username,
            userPoolId: req.params.userPoolId,
          },
        });

        await trx.insert({
          into: table(UserEmailVerify),
          insert: {
            userUsername: req.body.username,
            email: req.body.email,
            code: emailVerifyCode,
            issuedAt: new Date(),
          },
        });
        //TODO send email
      });

      successRegisterCounter.inc();
      res.status(200).end();
    } catch (e) {
      next(e);
    }
  });

  return router;
}
