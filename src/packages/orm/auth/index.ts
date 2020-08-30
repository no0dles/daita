export type ContextUser = AnonymousContextUser | AuthorizedContextUser;

export interface AnonymousContextUser {
  anonymous: true;
}

export interface AuthorizedContextUser {
  id: string;
  username: string | null;
  roles: string[];
  permissions: string[];
  anonymous: false;
}
