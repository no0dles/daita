import { OrderByDescription } from '../description/order-by';
import { ValueType } from '../description/value-type';

export function desc(field: ValueType) {
  return { direction: 'desc', value: field } as OrderByDescription;
}
