import { MaxDescription } from './max-description';
import { field } from '../../../keyword/field/field';
import { Constructable, PickByValue } from '../../../../../common/types';

export function max<T, K extends keyof PickByValue<T, number | Date>>(type: Constructable<T>, key: K): T[K] {
  return (<MaxDescription>{ max: field(type, key as any) as any }) as any;
}
