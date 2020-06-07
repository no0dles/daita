import { Constructable, PickByValue } from '@daita/common';
import { MinDescription } from '../description/min';
import { field } from './field';

export function min<T, K extends keyof PickByValue<T, number | Date>>(type: Constructable<T>, key: K): T[K] {
  return <MinDescription>{ min: field(type, key as any) as any } as any;
}
