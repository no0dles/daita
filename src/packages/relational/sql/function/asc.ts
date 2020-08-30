import { OrderByDescription, ValueType } from '../description';

export function asc(field: ValueType) {
  return {direction: 'asc', value: field} as OrderByDescription;
}
