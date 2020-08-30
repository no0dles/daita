import * as jwt from 'jsonwebtoken';
import { getKeyForId } from './key';
import { Defer } from '../../common/utils';

export async function verifyToken(token: string): Promise<any> {
  const payload = jwt.decode(token, { complete: true, json: true });
  if (!payload || !payload.header) {
    return null;
  }

  const key = await getKeyForId(payload.header.kid);

  const defer = new Defer<any>();
  jwt.verify(token, key.toPEM(), (err) => {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(payload.payload);
    }
  });
  return defer.promise;
}
