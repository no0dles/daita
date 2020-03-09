import {TokenProvider, AccessToken} from './token-provider';
import * as jws from 'jws';
import {Defer} from '@daita/core';

export interface AuthSecretProviderOptions {
  secret: string;
}

export function secretTokenProvider(options: AuthSecretProviderOptions): TokenProvider {
  return {
    verify(token: string): Promise<AccessToken> {
      const defer = new Defer<AccessToken>();
      const result = jws.decode(token);
      if (jws.verify(token, result.header.alg, options.secret)) {
        defer.resolve(result.payload);
      } else {
        defer.reject(new Error('invalid signature'));
      }
      return defer.promise;
    },
  };
}