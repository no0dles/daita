import { isExactKind } from '../../../common/utils';

export function anything(): number &
  string &
  Date &
  boolean &
  undefined &
  null {
  return { anything: {} } as never;
}

export const isAnything = (val: any) =>
  isExactKind(val, ['anything']) &&
  typeof val['anything'] === 'object' &&
  Object.keys(val['anything']).length === 0;
