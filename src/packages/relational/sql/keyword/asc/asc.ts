import { OrderByDescription } from '../../dml/select/order-by/order-by-description';
import { ValueType } from '../../operands/value-type';

export function asc(field: ValueType) {
  return { direction: 'asc', value: field } as OrderByDescription;
}
