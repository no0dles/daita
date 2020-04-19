import { BasePermission } from './base-permission';
import { isKind } from '../utils/is-kind';

export interface RolePermission<T> extends BasePermission<T> {
  role: string;
}

export const isRolePermission = (val: any): val is RolePermission<any> =>
  isKind<RolePermission<any>>(val, ['role']);
