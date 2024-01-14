import { AuthAnonymousDescription } from './auth-anonymous-description';
import { AuthAuthorizedDescription } from './auth-authorized-description';
import { AuthRoleDescription } from './auth-role-description';

export type AuthDescription = AuthAnonymousDescription | AuthAuthorizedDescription | AuthRoleDescription;
