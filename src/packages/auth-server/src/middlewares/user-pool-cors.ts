import * as express from 'express';
import { UserPoolCors } from '../models/user-pool-cors';
import cors = require('cors');
import { field } from '@daita/relational';
import { table } from '@daita/relational';
import { equal } from '@daita/relational';
import { Context } from '@daita/orm';

export function userPoolCors(client: Context<any>, fn: (req: express.Request) => string): express.RequestHandler<any> {
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
