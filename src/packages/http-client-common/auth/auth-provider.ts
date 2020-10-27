import { TokenAuthProvider } from './token-auth-provider';

export type AuthProvider = TokenAuthProvider;

export interface TokenSecret {
  token: string;
}

export interface JwtSecret {
  issuer: string;
  username: string;
  password: string;
}
