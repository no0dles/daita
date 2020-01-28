import {AccessToken} from './token-provider';
import {ContextUser} from '@daita/core/dist/auth';

export interface UserProvider {
  get(token: AccessToken): Promise<ContextUser>;
}