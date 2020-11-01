import * as express from 'express';
import { User } from '../models/user';
import { UserPool, UserPoolAlgorithm } from '../models/user-pool';
import { Role } from '../models/role';
import { UserRole } from '../models/user-role';
import { UserRefreshToken } from '../models/user-refresh-token';
import { compareHash } from '../modules/hash';
import { getAccessToken } from '../modules/key';
import { getRandomCode } from '../modules/random';
import { and, equal, field, join, or, table } from '../../relational/sql/function';

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res, next) => {
  try {
    const user = await req.app.client.selectFirst({
      select: {
        password: field(User, 'password'),
        username: field(User, 'username'),
        email: field(User, 'email'),
        emailVerified: field(User, 'emailVerified'),
        userPool: {
          id: field(UserPool, 'id'),
          accessTokenExpiresIn: field(UserPool, 'accessTokenExpiresIn'),
          algorithm: field(UserPool, 'algorithm'),
        },
      },
      from: table(User),
      join: [join(table(UserPool), equal(field(UserPool, 'id'), field(User, 'userPoolId')))],
      where: and(
        or(equal(field(User, 'username'), req.body.username), equal(field(User, 'email'), req.body.username)),
        equal(field(User, 'userPoolId'), req.params.userPoolId),
      ),
    });

    if (!user) {
      return res.status(400).json({ message: 'invalid credentials' });
    }

    const matchesHash = await compareHash(req.body.password, user.password);
    if (!matchesHash) {
      return res.status(400).json({ message: 'invalid credentials' });
    }

    const roles = await req.app.client.select({
      select: field(Role, 'name'),
      from: table(Role),
      join: [join(UserRole, equal(field(UserRole, 'roleName'), field(Role, 'name')))],
      where: equal(field(UserRole, 'userUsername'), user.username),
    });

    const refreshToken = await getRandomCode();
    const accessToken = await getAccessToken(
      req.params.userPoolId,
      {
        roles,
      },
      {
        subject: user.username,
        expiresIn: user.userPool.accessTokenExpiresIn,
        issuer: user.userPool.id,
        algorithm: user.userPool.algorithm as UserPoolAlgorithm,
      },
    );
    const idToken = await getAccessToken(
      req.params.userPoolId,
      {
        roles,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      {
        subject: user.username,
        expiresIn: user.userPool.accessTokenExpiresIn,
        issuer: user.userPool.id,
        algorithm: user.userPool.algorithm as UserPoolAlgorithm,
      },
    );

    await req.app.client.insert({
      insert: {
        userUsername: user.username,
        token: refreshToken,
        authorizedAt: new Date(),
        issuedAt: new Date(),
      },
      into: table(UserRefreshToken),
    });

    res.status(200).json({
      refresh_token: refreshToken,
      access_token: accessToken,
      id_token: idToken,
      expires_in: user.userPool.accessTokenExpiresIn,
      token_type: 'bearer',
    });
  } catch (e) {
    next(e);
  }
});

export = router;
