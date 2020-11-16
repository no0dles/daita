import * as express from 'express';
import { UserPoolCors } from '../models/user-pool-cors';
import cors from 'cors';
import { field } from '../../relational/sql/keyword/field/field';
import { table } from '../../relational/sql/keyword/table/table';
import { equal } from '../../relational/sql/operands/comparison/equal/equal';
import { Context } from '../../orm/context/context';

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
