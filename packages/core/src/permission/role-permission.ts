import {BasePermission} from './base-permission';

export interface RolePermission<T> extends BasePermission<T> {
  type: 'role',
  role: string;
}