import { SqlPermissions } from "@daita/relational";
import {isKind} from '@daita/common';

export interface TokenProvider {
  verify(token: string): Promise<TokenVerifyResult>;
}

export const isTokenProvider = (val: any): val is TokenProvider => isKind(val, ['verify']);

export interface TokenVerifyResult {
  permissions?: SqlPermissions | null;
  expireIn?: number;
}
