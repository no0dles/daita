export interface AppAuthorization {
  providers: AppAuthorizationProvider[];
  tokens: AppAuthorizationToken[];
}

export interface AppAuthorizationToken {
  userId: string;
  token: string;
}

export interface AppAuthorizationProvider {
  issuer: string;
  uri: string;
}
