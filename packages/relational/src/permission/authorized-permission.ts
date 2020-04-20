import { BasePermission } from './base-permission';
import { isKind } from '@daita/common';

export interface AuthorizedPermission<T> extends BasePermission<T> {
  authorized: true;
}

export const isAuthorizedPermission = (
  val: any,
): val is AuthorizedPermission<any> =>
  isKind<AuthorizedPermission<any>>(val, ['authorized']);
