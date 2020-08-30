import { SumDescription } from '../description/sum';
import { field } from './field';
import { Constructable, PickByValue } from '../../../common/types';

export function sum<T, K extends keyof PickByValue<T, number | Date>>(
  type: Constructable<T>,
  key: K,
): T[K] {
  return (<SumDescription>{ sum: field(type, key as any) as any }) as any;
}
