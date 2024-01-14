import { Router } from 'express';
import { getKeys } from '../../modules/key';

export const wellKnownRoute:Router = Router();

wellKnownRoute.get<{ userPoolId: string }>('/jwks.json', async (req, res, next) => {
  try {
    res.status(200).json(await getKeys(req.params.userPoolId));
  } catch (e) {
    next(e);
  }
});
