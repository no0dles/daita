import * as express from 'express';
import { client } from '../client';
import { UserRefreshToken } from '../models/user-refresh-token';
import { getRandomCode } from '../modules/random';
import { User } from '../models/user';
import { UserPool, UserPoolAlgorithm } from '../models/user-pool';
import { getAccessToken } from '../modules/key';
import { Role } from '../models/role';
import { UserRole } from '../models/user-role';
import {and, equal, field, join, table} from '../../relational/sql/function';

const router = express.Router({mergeParams: true});

router.post('/', async (req, res, next) => {
  try {
    const token = await client.selectFirst({
      select: {
        authorizedAt: field(UserRefreshToken, 'authorizedAt'),
        issuedAt: field(UserRefreshToken, 'issuedAt'),
        userUsername: field(UserRefreshToken, 'userUsername'),
        userPoolId: field(UserPool, 'id'),
        userPoolAlgorithm: field(UserPool, 'algorithm'),
        userPoolAccessTokenExpiresIn: field(UserPool, 'accessTokenExpiresIn'),
        refreshRefreshExpiresIn: field(UserPool, 'refreshRefreshExpiresIn'),
      },
      from: table(UserRefreshToken),
      join: [
        join(User, equal(field(User, 'username'), field(UserRefreshToken, 'userUsername'))),
        join(UserPool, equal(field(User, 'userPoolId'), field(UserPool, 'id'))),
      ],
      where: and(
        equal(field(UserRefreshToken, 'token'), req.body.refreshToken),
        equal(field(UserPool, 'id'), req.params.userPoolId),
      ),
    });

    if (!token) {
      return res.status(400).json({ message: 'invalid token' });
    }

    const expiresAt = Math.floor(token.issuedAt.getTime() / 1000) + token.refreshRefreshExpiresIn;
    const now = Math.floor(new Date().getTime() / 1000);
    if (now > expiresAt) {
      await client.delete({
        delete: table(UserRefreshToken),
        where: equal(field(UserRefreshToken, 'token'), req.body.refreshToken),
      });
      return res.status(400).json({
        message: 'token expired',
      });
    }

    const roles = await client.select({
      select: field(Role, 'name'),
      from: table(Role),
      join: [join(UserRole, equal(field(UserRole, 'roleName'), field(Role, 'name')))],
      where: equal(field(UserRole, 'userUsername'), token.userUsername),
    });

    const refreshToken = await getRandomCode();
    const accessToken = await getAccessToken({
      roles,
    }, {
      subject: token.userUsername,
      expiresIn: token.userPoolAccessTokenExpiresIn,
      issuer: token.userPoolId,
      algorithm: token.userPoolAlgorithm as UserPoolAlgorithm,
    });

    await client.transaction(async trx => {
      await trx.delete({
        delete: table(UserRefreshToken),
        where: equal(field(UserRefreshToken, 'token'), req.body.refreshToken),
      });
      await trx.insert({
        into: table(UserRefreshToken),
        insert: {
          userUsername: token.userUsername,
          token: refreshToken,
          issuedAt: new Date(),
          authorizedAt: token.authorizedAt,
        },
      });
    });

    return res.status(200).json({
      refresh_token: refreshToken,
      access_token: accessToken,
    });
  } catch (e) {
    next(e);
  }
});

export = router;
