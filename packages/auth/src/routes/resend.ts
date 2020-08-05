import * as express from 'express';
import { client } from '../client';
import { User } from '../models/user';
import { and, equal, field, table } from '@daita/relational';
import { UserEmailVerify } from '../models/user-email-verify';
import { getRandomCode } from '../modules/random';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = express.Router({mergeParams: true});

router.use(authMiddleware);
router.post('/', async (req, res, next) => {
  try {
    const user = await client.selectFirst({
      select: {
        username: field(User, 'username'),
        email: field(User, 'email'),
        emailVerified: field(User, 'emailVerified'),
      },
      from: table(User),
      where: and(
        equal(field(User, 'username'), (<any>req).user.sub),
        equal(field(User, 'userPoolId'), req.params.userPoolId)
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

    await client.insert({
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

export = router;
