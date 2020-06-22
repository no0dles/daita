import { AuthAnonymousDescription } from './auth-anonymous-description';
import { AuthAuthorizedDescription } from './auth-authorized-description';

export type AuthDescription =
  | AuthAnonymousDescription
  | AuthAuthorizedDescription;
