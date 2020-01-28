import {AccessToken, TokenProvider} from './token-provider';
import {Defer} from '@daita/core';
import * as jwt from 'jsonwebtoken';

export interface AuthKeyProviderOptions {
  key: string | Buffer;
}

export function keyTokenProvider(options: AuthKeyProviderOptions): TokenProvider {
  return {
    verify(token: string): Promise<AccessToken> {
      const defer = new Defer<AccessToken>();
      jwt.verify(token, options.key, {}, (err, decoded) => {
        if (err) {
          defer.reject(err);
        } else {
          defer.resolve(decoded as any);
        }
      });
      return defer.promise;
    },
  }
}