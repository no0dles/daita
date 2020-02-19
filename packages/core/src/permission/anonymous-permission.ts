import {BasePermission} from './base-permission';

export interface AnonymousPermission<T> extends BasePermission<T> {
  type: 'anonymous',
}