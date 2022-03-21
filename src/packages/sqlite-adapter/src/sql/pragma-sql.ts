import { isExactKind } from '@daita/common';

export interface PragmaSql {
  pragma: string;
  set: string;
}

export const isPragmaSql = (val: any): val is PragmaSql =>
  isExactKind(val, ['pragma', 'set']) && typeof val.pragma === 'string';
