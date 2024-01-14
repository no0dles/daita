import { isExactKind } from '@daita/common';

export interface MinuteDescription {
  minute: { value: Date };
}

export const isMinuteDescription = (val: any): val is MinuteDescription =>
  isExactKind<MinuteDescription>(val, ['minute']) && !!val.minute.value;
