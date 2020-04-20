import { BasePermission } from './base-permission';
import { isKind } from '@daita/common';

export interface PermissionPermission<T> extends BasePermission<T> {
  permission: string;
}

export const isPermissionPermission = (
  val: any,
): val is PermissionPermission<any> =>
  isKind<PermissionPermission<any>>(val, ['permission']);
