import {isExactKind} from '../../../common/utils';

export interface NowDescription {
  now: {};
}

export const isNowDescription = (val: any): val is NowDescription => isExactKind<NowDescription>(val, ['now']);
