import { isExactKind } from '../common/utils/is-exact-kind';
import { isKind } from '../common/utils/is-kind';

export type AuthProvider = TokenProvider | AccessTokenProvider | TokenIssuer;

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

export interface IssuerProvider {
  uri: string;
  issuer: string;
  refreshToken?: string;
  accessToken?: string;
  idToken?: string;
}
export const isIssuerProvider = (val: any): val is IssuerProvider => isKind<IssuerProvider>(val, ['uri', 'issuer']);
