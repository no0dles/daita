import { CountDescription } from './count-description';
import { ValueType } from '../../../operands/value-type';

export function count<T>(field?: ValueType, distinct?: boolean): number {
  return (<CountDescription>{ count: { field, distinct } }) as any;
}
