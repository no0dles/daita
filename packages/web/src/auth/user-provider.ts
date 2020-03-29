import {AccessToken} from './token-provider';
import {AuthorizedContextUser} from '@daita/core/dist/auth';

export interface UserProvider {
  get(token: AccessToken): Promise<AuthorizedContextUser>;
}