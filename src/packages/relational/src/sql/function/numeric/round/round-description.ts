import { isExactKind } from '@daita/common';

export interface RoundDescription {
  round: { value: number; precision?: number };
}

export const isRoundDescription = (val: any): val is RoundDescription =>
  isExactKind<RoundDescription>(val, ['round']) &&
  !!val.round.value &&
  (val.round.precision === undefined || val.round.precision === null || typeof val.round.precision === 'number');
