import { MaxDescription } from './max-description';
import { field } from '../../../keyword/field/field';
import { KeysOfType, PickByValue } from '@daita/common';
import { Constructable } from '@daita/common';
import { TableAliasDescription } from '../../../dml/select/table-alias-description';
import { TableDescription } from '../../../keyword/table/table-description';

export function max<T, K extends keyof KeysOfType<T, number | Date>>(
  type: Constructable<T> | TableAliasDescription<T> | TableDescription<T>,
  key: K,
): T[K] {
  return (<MaxDescription>{ max: field<T, K>(type as any, key) as any }) as any;
}
