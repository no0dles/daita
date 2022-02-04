import * as crypto from 'crypto';

export function getRandomCode() {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(256 / 8, (err, bytes) => {
      if (err) {
        return reject(err);
      }
      resolve(bytes.toString('hex'));
    });
  });
}
