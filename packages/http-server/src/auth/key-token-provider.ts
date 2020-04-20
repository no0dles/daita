import { TokenProvider, TokenVerifyResult } from "./token-provider";
import { Defer } from "@daita/common";
import * as jws from "jws";
import { payloadTransform, PayloadTransformer } from "./payload-provider";

export interface AuthKeyProviderOptions<T = any> {
  key: string | Buffer;
  payloadTransformer: PayloadTransformer<T>;
}

export function keyTokenProvider<T>(options: AuthKeyProviderOptions<T>): TokenProvider {
  return {
    verify(token: string): Promise<TokenVerifyResult> {
      const defer = new Defer<TokenVerifyResult>();
      const result = jws.decode(token);

      if (jws.verify(token, result.header.alg, options.key)) {
        defer.resolve(payloadTransform(options.payloadTransformer, result.payload));
      } else {
        defer.reject(new Error("invalid signature"));
      }
      return defer.promise;
    }
  };
}
