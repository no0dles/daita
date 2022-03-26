import { NodeHttp } from '@daita/node';

export class AuthorizedAuthClient {
  constructor(private http: NodeHttp, private userPoolId: string, private accessToken: string) {}

  getTokens() {}

  deleteToken(id: string) {}

  async createToken() {
    const res = await this.http.json({
      path: `/${this.userPoolId}/token`,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      data: {
        password: '123456',
        username: 'foo',
      },
    });
  }

  async resend() {}

  refresh() {}
}

export class AuthClient {
  constructor(private http: NodeHttp, private userPoolId: string) {}

  async register(email: string, username: string, password: string) {
    const res = await this.http.json({
      path: `/${this.userPoolId}/register`,
      data: {
        password,
        username,
        email,
      },
    });
  }

  async login(username: string, password: string): Promise<AuthorizedAuthClient> {
    const res = await this.http.json({
      path: `/${this.userPoolId}/login`,
      data: {
        password,
        username,
      },
    });
    return new AuthorizedAuthClient(this.http, this.userPoolId, res.data.access_token);
  }

  async verify(code: string) {
    const res = await this.http.get({
      path: `/${this.userPoolId}/verify`,
      query: {
        code: code,
      },
    });
  }
}

export function authClient(uri: string, userPoolId: string): AuthClient {
  const http = new NodeHttp(uri, null);
  return new AuthClient(http, userPoolId);
}
