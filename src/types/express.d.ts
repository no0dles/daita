declare namespace Express {
  export interface Request {
    user?: {
      type: 'token';
      userId: string;
      token: string;
    } | {
      type: 'jwt';
      sub: string;
      iss: string;
    } | {
      type: 'custom'
    };
    token?: { sub: string, issuer: string; };
  }
}
