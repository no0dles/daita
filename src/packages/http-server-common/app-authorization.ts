export interface AppAuthorization {
  providers?: AppAuthorizationProvider[];
  tokenEndpoints?: AppAuthorizationTokenEndpoint[];
  cors?: string[];
}

export interface AppAuthorizationTokenEndpoint {
  issuer: string;
  uri: string;
}

export interface AppAuthorizationProvider {
  issuer: string;
  uri: string;
}
