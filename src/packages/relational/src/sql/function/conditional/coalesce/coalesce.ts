import { CoalesceDescription } from './coalesce-description';
import { ValueType } from '../../../operands';

export function coalesce<T extends ValueType>(values: T[]): T {
  return (<CoalesceDescription>{ coalesce: { values } }) as any;
}
