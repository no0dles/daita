import { Router } from 'express';
import jwksRoute from './jwks';

const router = Router();

router.use(jwksRoute);

export = router;
