export interface AppAuthorization {
  providers?: AppAuthorizationProvider[];
  tokenEndpoint?: AppAuthorizationTokenEndpoint;
  cors?: string[];
}

export interface AppAuthorizationTokenEndpoint {
  url: string;
}

export interface AppAuthorizationProvider {
  issuer: string;
  uri: string;
}
