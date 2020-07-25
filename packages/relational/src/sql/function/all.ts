import { TableAliasDescription, TableDescription } from '../description';
import { Constructable, ExcludeNonPrimitive } from '@daita/common';
import { table } from './table';

export function all<T>(tbl?: TableDescription<T> | TableAliasDescription<T> | Constructable<T>): ExcludeNonPrimitive<T> {
  if (tbl) {
    if (typeof tbl === 'function') {
      return { all: { table: table(tbl) } } as any;
    } else {
      return { all: { table: tbl } } as any;
    }
  }

  return {
    all: {},
  } as any;
}
