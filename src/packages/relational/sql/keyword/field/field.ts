import { FieldDescription } from './field-description';
import { TableDescription } from '../table/table-description';
import { table } from '../table/table';
import { ValueType } from '../../operands/value-type';
import { TableAliasDescription } from '../../dml/select/table-alias-description';
import { PickByValue } from '../../../../common/types/pick-by-value';
import { Constructable } from '../../../../common/types/constructable';

export function field<T, K extends keyof PickByValue<T, ValueType>>(type: Constructable<T>, key: K): T[K];
export function field<T, K extends keyof PickByValue<T, ValueType>>(type: TableDescription<T>, key: K): T[K];
export function field<T, K extends keyof PickByValue<T, ValueType>>(type: TableAliasDescription<T>, key: K): T[K];
export function field<T, K extends keyof PickByValue<T, ValueType>>(
  typeOrAlias: Constructable<T> | TableAliasDescription<T> | TableDescription<T>,
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
