import { AuthProvider, isAccessTokenProvider, isTokenProvider, TokenIssuer } from './auth-provider';

export function getTokenIssuer(provider: AuthProvider | null | undefined): TokenIssuer {
  if (!provider) {
    return new FixedTokenProvider(null);
  } else if (isTokenProvider(provider)) {
    return new FixedTokenProvider(`Token ${provider.token}`);
  } else if (isAccessTokenProvider(provider)) {
    return new FixedTokenProvider(`Bearer ${provider.accessToken}`);
  } else {
    return provider;
  }
}

class FixedTokenProvider implements TokenIssuer {
  constructor(private token: string | null) {}

  getToken(): Promise<string | null> {
    return Promise.resolve(this.token);
  }
}
