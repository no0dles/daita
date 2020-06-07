import { Constructable, PickByValue } from '@daita/common';
import { AvgDescription } from '../description/avg';
import { field } from './field';

export function avg<T, K extends keyof PickByValue<T, number | Date>>(type: Constructable<T>, key: K): T[K] {
  return <AvgDescription>{ avg: field(type, key as any) as any } as any;
}
