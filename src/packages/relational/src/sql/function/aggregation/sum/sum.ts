import { SumDescription } from './sum-description';
import { field } from '../../../keyword/field/field';
import { PickByValue } from '@daita/common';
import { Constructable } from '@daita/common';

export function sum<T, K extends keyof PickByValue<T, number | Date>>(type: Constructable<T>, key: K): T[K] {
  return (<SumDescription>{ sum: field(type, key as any) as any }) as any;
}
