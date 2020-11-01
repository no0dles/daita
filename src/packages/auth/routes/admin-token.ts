import * as express from 'express';
import { UserToken } from '../models/user-token';
import { User } from '../models/user';
import { Role } from '../models/role';
import { UserRole } from '../models/user-role';
import { getSha1 } from '../modules/hash';
import { field } from '../../relational/sql/function/field';
import { and } from '../../relational/sql/function/and';
import { table } from '../../relational/sql/function/table';
import { join } from '../../relational/sql/function/join';
import { equal } from '../../relational/sql/function/equal';

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
      join: [join(table(User), equal(field(User, 'username'), field(UserToken, 'userUsername')))],
      where: and(
        equal(field(UserToken, 'token'), hashedToken),
        equal(field(User, 'userPoolId'), req.params.userPoolId),
      ),
    });

    if (!token) {
      return res.status(401).end();
    }

    const roles = await req.app.client.select({
      select: field(Role, 'name'),
      from: table(Role),
      join: [join(UserRole, equal(field(UserRole, 'roleName'), field(Role, 'name')))],
      where: equal(field(UserRole, 'userUsername'), token.username),
    });
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
