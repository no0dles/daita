import { AnonymousContextUser } from './anonymous-context-user';
import { AuthorizedContextUser } from './authorized-context-user';

export type ContextUser = AnonymousContextUser | AuthorizedContextUser;
