import { BasePermission } from './base-permission';
import { isKind } from '@daita/common';

export interface RolePermission<T> extends BasePermission<T> {
  role: string;
}

export const isRolePermission = (val: any): val is RolePermission<any> =>
  isKind<RolePermission<any>>(val, ['role']);
