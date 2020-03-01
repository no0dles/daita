export interface ContextUser {
  id: string;
  username: string | null;
  roles: string[]
  claims: string[];
}