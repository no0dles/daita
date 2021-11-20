import { ValueType } from '../../../operands/value-type';
import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface OrderByDescription {
  value: ValueType;
  direction: 'asc' | 'desc';
}

export const isOrderByDescription = (val: any): val is OrderByDescription =>
  isExactKind<OrderByDescription>(val, ['value', 'direction']) && (val.direction === 'asc' || val.direction === 'desc');
