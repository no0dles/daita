import { BasePermission } from './base-permission';
import { isKind } from '../utils/is-kind';

export interface AuthorizedPermission<T> extends BasePermission<T> {
  authorized: true;
}

export const isAuthorizedPermission = (
  val: any,
): val is AuthorizedPermission<any> =>
  isKind<AuthorizedPermission<any>>(val, ['authorized']);
