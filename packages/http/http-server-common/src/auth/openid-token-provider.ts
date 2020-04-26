import { TokenProvider, TokenVerifyResult } from "./token-provider";
import * as openid from "openid-client";
import { Defer } from "@daita/common";
import { jwksTokenProvider } from "./jwks-token-provider";
import { PayloadTransformer } from "./payload-provider";

export interface AuthOpenIdProviderOptions<T = any> {
  uri: string;
  clientId: string;
  clientSecret: string;
  payloadTransformer: PayloadTransformer<T>;
}

export function openIdTokenProvider<T>(options: AuthOpenIdProviderOptions<T>): TokenProvider {
  const jwksDefer = new Defer<string>();
  openid.Issuer.discover(options.uri).then(res => {
    jwksDefer.resolve(res.metadata.jwks_uri);
  });

  const jwksProviderPromise = jwksDefer.promise.then(uri => jwksTokenProvider<T>({
    jwksUri: uri,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    payloadTransformer: options.payloadTransformer
  }));

  return {
    async verify(token: string): Promise<TokenVerifyResult> {
      const jwksProvider = await jwksProviderPromise;
      return jwksProvider.verify(token);
    }
  };
}
