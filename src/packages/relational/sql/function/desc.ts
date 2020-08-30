import { OrderByDescription, ValueType } from '../description';

export function desc(field: ValueType) {
  return {direction: 'desc', value: field} as OrderByDescription;
}
