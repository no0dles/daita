import { TableAliasDescription, TableDescription } from '../description';
import { Constructable } from '@daita/common';
import { table } from './table';

export function all<T>(tbl?: TableDescription<T> | TableAliasDescription<T> | Constructable<T>): T {
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
