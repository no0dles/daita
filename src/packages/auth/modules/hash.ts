import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {Defer} from '../../common/utils';

export function getSha1(text: string) {
  const sha = crypto.createHash('sha1');
  return sha.update(text).digest('hex');
}

export function compareHash(password: string, hash: string) {
  const defer = new Defer<boolean>();
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      return defer.reject(err);
    }
    defer.resolve(result);
  });
  return defer.promise;
}

export function hashPassword(password: string) {
  const defer = new Defer<string>();
  bcrypt.hash(password, 12, (err, hash) => {
    if (err) {
      return defer.reject(err);
    }
    defer.resolve(hash);
  });
  return defer.promise;
}
