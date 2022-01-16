import { Router } from 'express';
import { getSha1 } from '../modules/hash';
import { field, RelationalAdapter } from '@daita/relational';
import { and } from '@daita/relational';
import { table } from '@daita/relational';
import { join } from '@daita/relational';
import { equal } from '@daita/relational';
import { getRoles } from '../modules/roles';
import { User, UserPoolUser, UserToken } from '@daita/auth';

export function adminTokenRoute(client: RelationalAdapter<any>) {
  const router = Router({ mergeParams: true });

  router.post('/:token', async (req, res, next) => {
    try {
      const hashedToken = await getSha1(req.params.token);
      const token = await client.selectFirst({
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

      const roles = await getRoles(client, req.params.userPoolId, token.username);
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

  return router;
}
