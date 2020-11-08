import { FieldDescription } from '../../../keyword/field/field-description';
import { ValueType } from '../../../operands/value-type';
import { isExactKind } from '../../../../../common/utils/is-exact-kind';

export interface CountDescription {
  count: { field: ValueType | FieldDescription; distinct?: boolean };
}

export const isCountDescription = (val: any): val is CountDescription => isExactKind<CountDescription>(val, ['count']);
