import * as express from 'express';
import * as jwksRoute from './jwks';

const router = express.Router();

router.use(jwksRoute);

export = router;
