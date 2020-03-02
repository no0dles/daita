import {AccessToken, TokenProvider} from './token-provider';
import {Defer} from '@daita/core';
import * as jws from 'jws';

export interface AuthKeyProviderOptions {
  key: string | Buffer;
}

export function keyTokenProvider(options: AuthKeyProviderOptions): TokenProvider {
  return {
    verify(token: string): Promise<AccessToken> {
      const defer = new Defer<AccessToken>();
      const result = jws.decode(token);

      if (jws.verify(result.signature, result.header.alg, options.key)) {
        defer.resolve(result.payload);
      } else {
        defer.reject(new Error('invalid signature'));
      }
      return defer.promise;
    },
  };
}