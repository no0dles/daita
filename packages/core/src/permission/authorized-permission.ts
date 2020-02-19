import {BasePermission} from './base-permission';

export interface AuthorizedPermission<T> extends BasePermission<T> {
  type: 'authorized',
}
