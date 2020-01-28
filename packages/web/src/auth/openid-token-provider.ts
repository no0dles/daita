import {AccessToken, TokenProvider} from './token-provider';
import * as openid from 'openid-client';
import {Defer} from '@daita/core';
import {jwksTokenProvider} from './jwks-token-provider';

export interface AuthOpenIdProviderOptions {
  uri: string;
  clientId: string;
  clientSecret: string;
}

export function openIdTokenProvider(options: AuthOpenIdProviderOptions): TokenProvider {
  const jwksDefer = new Defer<string>();
  openid.Issuer.discover(options.uri).then(res => {
    jwksDefer.resolve(res.metadata.jwks_uri);
  });

  const jwksProviderPromise = jwksDefer.promise.then(uri => jwksTokenProvider({
    jwksUri: uri,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
  }));

  return {
    async verify(token: string): Promise<AccessToken> {
      const jwksProvider = await jwksProviderPromise;
      return jwksProvider.verify(token);
    },
  }
}