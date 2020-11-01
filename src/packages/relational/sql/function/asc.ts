import { OrderByDescription } from '../description/order-by';
import { ValueType } from '../description/value-type';

export function asc(field: ValueType) {
  return { direction: 'asc', value: field } as OrderByDescription;
}
