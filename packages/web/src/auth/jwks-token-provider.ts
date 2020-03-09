import * as JwksClient from 'jwks-rsa';
import * as jws from 'jws';
import {AccessToken, TokenProvider} from './token-provider';
import {Defer} from '@daita/core';

export interface AuthJwksProviderOptions {
  jwksUri: string;
  clientId: string;
  clientSecret: string;
}

export function jwksTokenProvider(options: AuthJwksProviderOptions): TokenProvider {
  const client = JwksClient({
    jwksUri: options.jwksUri,
  });

  const keyDefer = new Defer<JwksClient.SigningKey[]>();
  client.getSigningKeys((err, keys) => {
    if (err) {
      keyDefer.reject(err);
    } else {
      keyDefer.resolve(keys);
    }
  });

  return {
    async verify(token: string): Promise<AccessToken> {
      const defer = new Defer<AccessToken>();
      const keys = await keyDefer.promise;

      const payload = jws.decode(token);
      let key: JwksClient.SigningKey | null = null;

      if (payload.header.kid) {
        key = keys.filter(k => k.kid === payload.header.kid)[0];
      } else {
        key = keys[0];
      }

      if (!key) {
        throw new Error('no key found');
      }

      if (jws.verify(token, payload.header.alg, key.getPublicKey())) {
        defer.resolve(payload.payload);
      } else {
        defer.reject(new Error('invalid signature'));
      }

      return defer.promise;
    },
  };
}