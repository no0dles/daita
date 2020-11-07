import { OrderByDescription } from '../../dml/select/order-by/order-by-description';
import { ValueType } from '../../operands/value-type';

export function desc(field: ValueType) {
  return { direction: 'desc', value: field } as OrderByDescription;
}
