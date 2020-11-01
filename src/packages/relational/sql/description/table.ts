import { isKind } from '../../../common/utils/is-kind';

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
