import * as express from 'express';
import { getKeys } from '../../modules/key';

const router = express.Router();

router.get('/jwks.json', async (req, res, next) => {
  try {
    res.status(200).json(await getKeys());
  } catch (e) {
    next(e);
  }
});

export = router;
