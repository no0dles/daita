import { FieldDescription } from './field-description';
import { TableDescription } from '../table/table-description';
import { table } from '../table/table';
import { ValueType } from '../../operands/value-type';
import { TableAliasDescription } from '../../dml/select/table-alias-description';
import { KeysOfType } from '../../../../common/types/pick-by-value';
import { Constructable } from '../../../../common/types/constructable';
import { Json } from '../../../types/json/json';
import { DeepRequired } from 'utility-types';
import { JsonFieldDescription } from './json-field-description';

export type JsonField<T> = { [P in keyof T]: T[P] extends Json<any> ? Required<T[P]['json']['value']> : never };
export type JsonFieldSelector<T, K> = (t: JsonField<T>) => K;

export function field<T, K extends keyof KeysOfType<T, ValueType>>(type: Constructable<T>, key: K): T[K];
export function field<T, K extends ValueType>(
  type: Constructable<T>,
  selector: JsonFieldSelector<DeepRequired<T>, K>,
): string;
export function field<T, K extends keyof KeysOfType<T, ValueType>>(type: TableDescription<T>, key: K): T[K];
export function field<T, K extends ValueType>(
  type: TableDescription<T>,
  selector: JsonFieldSelector<DeepRequired<T>, K>,
): string;
export function field<T, K extends keyof KeysOfType<T, ValueType>>(type: TableAliasDescription<T>, key: K): T[K];
export function field<T, K extends ValueType>(
  type: TableAliasDescription<T>,
  selector: JsonFieldSelector<T, K>,
): string;
export function field<T, K extends keyof KeysOfType<T, ValueType>>(
  typeOrAlias: Constructable<T> | TableAliasDescription<T> | TableDescription<T>,
  key: K | JsonFieldSelector<DeepRequired<T>, K>,
): T[K] {
  if (typeof typeOrAlias === 'function') {
    if (typeof key === 'function') {
      return (<JsonFieldDescription>{
        jsonField: { keys: getSelectorPath(key), table: table(typeOrAlias) },
      }) as any;
    } else {
      return (<FieldDescription>{
        field: { key, table: table(typeOrAlias) },
      }) as any;
    }
  } else {
    if (typeof key === 'function') {
      return (<JsonFieldDescription>{ jsonField: { keys: getSelectorPath(key), table: typeOrAlias } }) as any;
    } else {
      return (<FieldDescription>{ field: { key, table: typeOrAlias } }) as any;
    }
  }
}

function getSelectorPath(fn: (proxy: any) => any): string[] {
  const path: string[] = [];
  const proxy: any = new Proxy(() => {}, {
    get: (target, p, receiver) => {
      path.push(p.toString());
      return proxy;
    },
  });
  fn(proxy);
  return path;
}
