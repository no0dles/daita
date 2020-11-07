import * as express from 'express';
import { UserToken } from '../models/user-token';
import { User } from '../models/user';
import { getSha1 } from '../modules/hash';
import { field } from '../../relational/sql/keyword/field/field';
import { and } from '../../relational/sql/keyword/and/and';
import { table } from '../../relational/sql/keyword/table/table';
import { join } from '../../relational/sql/dml/select/join/join';
import { equal } from '../../relational/sql/operands/comparison/equal/equal';
import { UserPoolUser } from '../models/user-pool-user';
import { getRoles } from '../modules/roles';

const router = express.Router({ mergeParams: true });

router.post('/:token', async (req, res, next) => {
  try {
    const hashedToken = await getSha1(req.params.token);
    const token = await req.app.client.selectFirst({
      select: {
        username: field(User, 'username'),
        expiresAt: field(UserToken, 'expiresAt'),
        createdAt: field(UserToken, 'createdAt'),
        userPoolId: field(User, 'userPoolId'),
      },
      from: table(UserToken),
      join: [
        join(User, equal(field(User, 'username'), field(UserToken, 'userUsername'))),
        join(UserPoolUser, equal(field(UserPoolUser, 'userUsername'), field(User, 'username'))),
      ],
      where: and(
        equal(field(UserToken, 'token'), hashedToken),
        equal(field(UserPoolUser, 'userPoolId'), req.params.userPoolId),
      ),
    });

    if (!token) {
      return res.status(401).end();
    }

    const roles = await getRoles(req.app.client, req.params.userPoolId, token.username);
    res.status(200).json({
      roles,
      sub: token.username,
      iss: token.userPoolId,
      exp: token.expiresAt ? Math.floor(token.expiresAt.getTime() / 1000) : null,
      iat: Math.floor(token.createdAt.getTime() / 1000),
    });
  } catch (e) {
    next(e);
  }
});

export = router;
