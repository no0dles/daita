import { CountDescription } from '../description/count';
import { ValueType } from '../description/value-type';


export function count<T>(field?: ValueType, distinct?: boolean): number {
  return <CountDescription>{ count: { field, distinct } } as any;
}
