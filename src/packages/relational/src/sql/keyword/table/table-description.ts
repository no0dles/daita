import { isKind } from '@daita/common';

export interface TableDescription<T> {
  name?: undefined;
  table: string;
  schema?: string;
}

export const isTableDescription = (val: any): val is TableDescription<any> =>
  isKind<TableDescription<any>>(val, ['table']) &&
  typeof val.table === 'string' &&
  /^[a-zA-Z0-9_]+$/.test(val.table) &&
  (!val.schema || (typeof val.schema === 'string' && /^[a-zA-Z0-9_]+$/.test(val.schema)));

export const compareTableDescription = (first: TableDescription<any>, second: TableDescription<any>) =>
  first.table === second.table && first.schema === second.schema;
