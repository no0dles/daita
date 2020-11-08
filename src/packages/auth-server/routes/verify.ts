import * as express from 'express';
import { UserEmailVerify } from '../models/user-email-verify';
import { User } from '../models/user';
import { UserPool } from '../models/user-pool';
import { field } from '../../relational/sql/keyword/field/field';
import { and } from '../../relational/sql/keyword/and/and';
import { table } from '../../relational/sql/keyword/table/table';
import { join } from '../../relational/sql/dml/select/join/join';
import { equal } from '../../relational/sql/operands/comparison/equal/equal';
import { isNull } from '../../relational/sql/operands/comparison/is-null/is-null';
import { TransactionClient } from '../../relational/client/transaction-client';

export function verifyRoute(client: TransactionClient<any>) {
  const router = express.Router({ mergeParams: true });

  router.get('/', async (req, res, next) => {
    try {
      const verify = await client.selectFirst({
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
        return res.status(400).json({ message: 'invalid code' });
      }

      await client.transaction(async (trx) => {
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

      res.status(200).end();
    } catch (e) {
      next(e);
    }
  });

  return router;
}
