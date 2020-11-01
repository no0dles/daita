import * as express from 'express';
import { UserPoolCors } from '../models/user-pool-cors';
import cors2 from 'cors';
import { field } from '../../relational/sql/function/field';
import { table } from '../../relational/sql/function/table';
import { equal } from '../../relational/sql/function/equal';

export function cors(fn: (req: express.Request) => string): express.RequestHandler<any> {
  return cors2(async (req, callback) => {
    try {
      const userPoolId = fn(req);
      if (!userPoolId) {
        return callback(null, {
          origin: [],
        });
      }

      const urls = await req.app.client.select({
        select: field(UserPoolCors, 'url'),
        from: table(UserPoolCors),
        where: equal(field(UserPoolCors, 'userPoolId'), userPoolId),
      });

      callback(null, {
        origin: urls,
      });
    } catch (e) {
      callback(e, undefined);
    }
  });
}
