import { SqlPermissions } from "@daita/relational";
import { TokenVerifyResult } from "./token-provider";

export type PayloadTransformer<T = any> = (payload: T) => SqlPermissions | undefined | null;

export function payloadTransform<T = any>(payloadTransformer: PayloadTransformer<T>, payload: T): TokenVerifyResult {
  const permissions = payloadTransformer(payload);
  if ((<any>payload).iat) {
    const now = Math.floor(new Date().getTime() / 1000);
    const timeExpired = ((<any>payload).iat - now) * 1000;
    return { expireIn: timeExpired, permissions };
  } else {
    return { permissions };
  }
}
