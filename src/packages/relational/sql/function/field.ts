import { FieldDescription } from '../description/field';
import { TableDescription } from '../description/table';
import { table } from './table';
import { ValueType } from '../description/value-type';
import { TableAliasDescription } from '../description/table-alias';
import { Constructable, PickByValue } from '../../../common/types';

export function field<T, K extends keyof PickByValue<T, ValueType>>(
  type: Constructable<T>,
  key: K,
): T[K];
export function field<T, K extends keyof PickByValue<T, ValueType>>(
  type: TableDescription<T>,
  key: K,
): T[K];
export function field<T, K extends keyof PickByValue<T, ValueType>>(
  type: TableAliasDescription<T>,
  key: K,
): T[K];
export function field<T, K extends keyof PickByValue<T, ValueType>>(
  typeOrAlias:
    | Constructable<T>
    | TableAliasDescription<T>
    | TableDescription<T>,
  key: K,
): T[K] {
  if (typeof typeOrAlias === 'function') {
    return (<FieldDescription>{
      field: { key, table: table(typeOrAlias) },
    }) as any;
  } else {
    return (<FieldDescription>{ field: { key, table: typeOrAlias } }) as any;
  }
}
