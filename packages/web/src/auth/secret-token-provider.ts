import {TokenProvider, AccessToken} from './token-provider';
import * as jwt from 'jsonwebtoken';
import {Defer} from '@daita/core';

export interface AuthSecretProviderOptions {
  secret: string;
}

export function secretTokenProvider(options: AuthSecretProviderOptions): TokenProvider {
  return {
    verify(token: string): Promise<AccessToken> {
      const defer = new Defer<AccessToken>();
      jwt.verify(token, options.secret, {}, (err, decoded) => {
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