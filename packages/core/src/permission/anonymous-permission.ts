import { BasePermission } from './base-permission';
import { isKind } from '../utils/is-kind';

export interface AnonymousPermission<T> extends BasePermission<T> {
  anonymous: true;
}
export const isAnonymousPermission = (
  val: any,
): val is AnonymousPermission<any> =>
  isKind<AnonymousPermission<any>>(val, ['anonymous']);
