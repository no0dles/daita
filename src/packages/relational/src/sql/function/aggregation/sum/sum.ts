import { SumDescription } from './sum-description';
import { field } from '../../../keyword/field/field';
import { PickByValue } from '@daita/common/types/pick-by-value';
import { Constructable } from '@daita/common/types/constructable';

export function sum<T, K extends keyof PickByValue<T, number | Date>>(type: Constructable<T>, key: K): T[K] {
  return (<SumDescription>{ sum: field(type, key as any) as any }) as any;
}
