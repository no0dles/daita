import { Router } from 'express';
import { getKeys } from '../../modules/key';

const router = Router();

router.get('/jwks.json', async (req, res, next) => {
  try {
    res.status(200).json(await getKeys(req.params.userPoolId));
  } catch (e) {
    next(e);
  }
});

export = router;
