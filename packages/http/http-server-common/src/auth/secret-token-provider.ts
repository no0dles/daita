import { TokenProvider, TokenVerifyResult } from "./token-provider";
import * as jws from "jws";
import { payloadTransform, PayloadTransformer } from "./payload-provider";
import { Defer } from "@daita/common";

export interface AuthSecretProviderOptions<T> {
  secret: string;
  payloadTransformer: PayloadTransformer<T>;
}

export function secretTokenProvider<T = any>(options: AuthSecretProviderOptions<T>): TokenProvider {
  return {
    verify(token: string): Promise<TokenVerifyResult> {
      const defer = new Defer<TokenVerifyResult>();
      const result = jws.decode(token);
      if (jws.verify(token, result.header.alg, options.secret)) {
        defer.resolve(payloadTransform(options.payloadTransformer, result.payload));
      } else {
        defer.reject(new Error("invalid signature"));
      }
      return defer.promise;
    }
  };
}
