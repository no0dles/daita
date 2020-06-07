import { TableAliasDescription } from './table-alias';
import { TableDescription } from './table';
import { isExactKind } from '@daita/common';

export interface AllDescription<T> {
  all: {table?: TableAliasDescription<T> | TableDescription<T> };
}

export const isAllDescription = (val: any): val is AllDescription<any> => isExactKind<AllDescription<any>>(val, ['all']);
