import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export function getSha1(text: string) {
  const sha = crypto.createHash('sha1');
  return sha.update(text).digest('hex');
}

export function compareHash(password: string, hash: string) {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

export function hashPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, 12, (err, hash) => {
      if (err) {
        return reject(err);
      }
      resolve(hash);
    });
  });
}
