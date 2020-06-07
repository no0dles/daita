import { isExactKind } from '@daita/common';

export interface NowDescription {
  now: {};
}

export const isNowDescription = (val: any): val is NowDescription => isExactKind<NowDescription>(val, ['now']);
