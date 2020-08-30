import * as express from 'express';
import { client } from '../client';
import { UserPoolCors } from '../models/user-pool-cors';
import * as cors2 from 'cors';
import { equal, field, table } from '../../relational/sql/function';

export function cors(
  fn: (req: express.Request) => string,
): express.RequestHandler<any> {
  return cors2(async (req, callback) => {
    try {
      const userPoolId = fn(req);
      if (!userPoolId) {
        return callback(null, {
          origin: [],
        });
      }

      const urls = await client.select({
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
