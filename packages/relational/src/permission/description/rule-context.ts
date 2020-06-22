
export interface RuleContext {
  isAuthorized: boolean
  token?: {
    header: {
      alg: string;
      typ: string;
    },
    payload: {
      iss: string;
      aud: string;
      sub: string;
      jti: string;
    }
  }
}
