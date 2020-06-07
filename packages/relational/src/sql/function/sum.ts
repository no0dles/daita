import { Constructable, PickByValue } from '@daita/common';
import { SumDescription } from '../description/sum';
import { field } from './field';

export function sum<T, K extends keyof PickByValue<T, number | Date>>(type: Constructable<T>, key: K): T[K] {
  return <SumDescription>{ sum: field(type, key as any) as any } as any;
}
