export interface HttpServerAuthorization {
  providers?: HttpServerAuthorizationProvider[];
  tokenEndpoints?: HttpServerAuthorizationTokenEndpoint[];
  cors?: string[];
  disableRules?: boolean;
}

export interface HttpServerAuthorizationTokenEndpoint {
  issuer: string;
  uri: string;
}

export interface HttpServerAuthorizationProvider {
  issuer: string;
  uri: string;
}
