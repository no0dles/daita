import { AuthProvider, isAccessTokenProvider, isTokenProvider, TokenIssuer } from './auth-provider';
import { Http } from './http';

export function getTokenIssuer(provider: AuthProvider | null | undefined, http: Http): TokenIssuer {
  if (!provider) {
    return new FixedTokenProvider(null);
  } else if (isTokenProvider(provider)) {
    return new FixedTokenProvider(`Token ${provider.token}`);
  } else if (isAccessTokenProvider(provider)) {
    return new FixedTokenProvider(`Bearer ${provider.accessToken}`);
  } else {
    return provider;
    //return new IssuerTokenProvider(provider, http);
  }
}

// class TokenUser {
//   private expireAt: Date;
//
//   constructor(private refreshToken: string, private accessToken: string) {}
//
//   isExpired() {
//     const now = new Date().getTime() / 1000;
//     return this.accessToken && this.accessTokenPayload.exp - now < 60;
//   }
// }

// class IssuerTokenProvider implements TokenIssuer {
//   constructor(private options: IssuerProvider, private http: Http) {}
//
//   getToken(): Promise<string | null> {
//     this.http.json({});
//     return Promise.resolve(undefined);
//   }
// }

class FixedTokenProvider implements TokenIssuer {
  constructor(private token: string | null) {}

  getToken(): Promise<string | null> {
    return Promise.resolve(this.token);
  }
}
