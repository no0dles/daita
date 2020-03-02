export interface TokenAuthProvider {
  kind: 'token';
  getToken(): Promise<string | null>;
}