
export type ContextAuthorization = AnonymousAuthorization | Authorized;

export interface AnonymousAuthorization {
  isAnonymous: true;
}

export interface Authorized {
  isAnonymous: false;
  userId: string;
}
