import { table } from '../table/table';
import { Constructable, ExcludeNonPrimitive } from '../../../../common/types';
import { TableAliasDescription } from '../../dml/select/table-alias-description';
import { TableDescription } from '../table/table-description';

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
