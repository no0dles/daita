import * as express from 'express';

const router = express.Router({ mergeParams: true });

router.post('/', (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
});

export = router;
