import { isExactKind } from '@daita/common';

export interface NowDescription {
  now: Record<string, never>;
}

export const isNowDescription = (val: any): val is NowDescription => isExactKind<NowDescription>(val, ['now']);
