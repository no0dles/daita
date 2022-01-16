import * as express from 'express';
import cors = require('cors');
import { field, RelationalAdapter } from '@daita/relational';
import { table } from '@daita/relational';
import { equal } from '@daita/relational';
import { UserPoolCors } from '@daita/auth';

export function userPoolCors(
  client: RelationalAdapter<any>,
  fn: (req: express.Request) => string,
): express.RequestHandler<any> {
  return cors(async (req, callback) => {
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
