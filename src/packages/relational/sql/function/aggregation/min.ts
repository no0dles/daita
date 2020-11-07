import { MinDescription } from './min-description';
import { field } from '../../keyword/field/field';
import { Constructable, PickByValue } from '../../../../common/types';

export function min<T, K extends keyof PickByValue<T, number | Date>>(type: Constructable<T>, key: K): T[K] {
  return (<MinDescription>{ min: field(type, key as any) as any }) as any;
}
