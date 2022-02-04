export interface AuthorizedContextUser {
  id: string;
  username: string | null;
  roles: string[];
  //permissions: string[];
  anonymous: false;
}
