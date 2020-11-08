import { MaxDescription } from './max-description';
import { field } from '../../../keyword/field/field';
import { PickByValue } from '../../../../../common/types/pick-by-value';
import { Constructable } from '../../../../../common/types/constructable';

export function max<T, K extends keyof PickByValue<T, number | Date>>(type: Constructable<T>, key: K): T[K] {
  return (<MaxDescription>{ max: field(type, key as any) as any }) as any;
}
