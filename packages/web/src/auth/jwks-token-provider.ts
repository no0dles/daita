import * as JwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
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

  return {
    verify(token: string): Promise<AccessToken> {
      const defer = new Defer<AccessToken>();
      client.getSigningKeys((err, keys) => {
        if (err) {
          defer.reject(err);
        } else {
          console.log(keys, token);
          //todo use kid
          jwt.verify(token, keys[0].getPublicKey(), {}, (verifyErr, decoded) => {
            if (verifyErr) {
              defer.reject(verifyErr);
            } else {
              defer.resolve(decoded as any);
            }
          })
        }
      });
      return defer.promise;
    },
  }
}