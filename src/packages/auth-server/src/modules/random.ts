import * as crypto from 'crypto';
import { Defer } from '@daita/common/utils/defer';

export function getRandomCode() {
  const defer = new Defer<string>();
  crypto.randomBytes(256 / 8, (err, bytes) => {
    if (err) {
      return defer.reject(err);
    }
    defer.resolve(bytes.toString('hex'));
  });
  return defer.promise;
}
