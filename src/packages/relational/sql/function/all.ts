import { TableAliasDescription, TableDescription } from '../description';
import { table } from './table';
import { Constructable, ExcludeNonPrimitive } from '../../../common/types';

export function all<T>(
  tbl?: TableDescription<T> | TableAliasDescription<T> | Constructable<T>,
): ExcludeNonPrimitive<T> {
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
