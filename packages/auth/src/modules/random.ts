import { Defer } from '@daita/common';
import * as crypto from "crypto";

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

