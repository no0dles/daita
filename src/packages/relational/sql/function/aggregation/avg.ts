import { AvgDescription } from './avg-description';
import { field } from '../../keyword/field/field';
import { Constructable, PickByValue } from '../../../../common/types';

export function avg<T, K extends keyof PickByValue<T, number | Date>>(type: Constructable<T>, key: K): T[K] {
  return (<AvgDescription>{ avg: field(type, key as any) as any }) as any;
}
