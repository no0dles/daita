import { isExactKind } from '@daita/common';

export type AuthProvider = TokenProvider | AccessTokenProvider | TokenIssuer;

export interface LoginOptions {
  userPoolId: string;
  username: string;
  password: string;
}

export interface User {
  email: string;
  emailVerified: boolean;
}

export interface TokenProvider {
  token: string;
}

export const isTokenProvider = (val: any): val is TokenProvider => isExactKind<TokenProvider>(val, ['token']);

export interface AccessTokenProvider {
  accessToken: string;
}

export const isAccessTokenProvider = (val: any): val is AccessTokenProvider =>
  isExactKind<AccessTokenProvider>(val, ['accessToken']);

export interface TokenIssuer {
  getToken(): Promise<string | null>;
}
