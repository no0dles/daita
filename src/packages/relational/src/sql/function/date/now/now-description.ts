import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface NowDescription {
  now: {};
}

export const isNowDescription = (val: any): val is NowDescription => isExactKind<NowDescription>(val, ['now']);
