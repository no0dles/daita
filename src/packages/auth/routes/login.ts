import * as express from 'express';
import { User } from '../models/user';
import { UserPool, UserPoolAlgorithm } from '../models/user-pool';
import { UserRefreshToken } from '../models/user-refresh-token';
import { compareHash } from '../modules/hash';
import { getAccessToken } from '../modules/key';
import { getRandomCode } from '../modules/random';
import { or } from '../../relational/sql/function/or';
import { field } from '../../relational/sql/function/field';
import { and } from '../../relational/sql/function/and';
import { table } from '../../relational/sql/function/table';
import { equal } from '../../relational/sql/function/equal';
import { join } from '../../relational/sql/function/join';
import { UserPoolUser } from '../models/user-pool-user';
import { getRoles } from '../modules/roles';

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
      join: [
        join(table(UserPoolUser), equal(field(UserPoolUser, 'userUsername'), field(User, 'username'))),
        join(table(UserPool), equal(field(UserPoolUser, 'userPoolId'), field(UserPool, 'id'))),
      ],
      where: and(
        or(equal(field(User, 'username'), req.body.username), equal(field(User, 'email'), req.body.username)),
        equal(field(UserPoolUser, 'userPoolId'), req.params.userPoolId),
      ),
    });

    if (!user) {
      return res.status(400).json({ message: 'invalid credentials' });
    }

    const matchesHash = await compareHash(req.body.password, user.password);
    if (!matchesHash) {
      return res.status(400).json({ message: 'invalid credentials' });
    }

    const roles = await getRoles(req.app.client, req.params.userPoolId, user.username);
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
        userPoolId: req.params.userPoolId,
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
