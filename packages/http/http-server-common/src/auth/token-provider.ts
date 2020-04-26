import { SqlPermissions } from "@daita/relational";

export interface TokenProvider {
  verify(token: string): Promise<TokenVerifyResult>;
}

export interface TokenVerifyResult {
  permissions?: SqlPermissions | null;
  expireIn?: number;
}
