import { isExactKind } from '@daita/common';

export interface PostgresListenSql {
  listen: string;
}

export const isListenSql = (val: any): val is PostgresListenSql => isExactKind<PostgresListenSql>(val, ['listen']);
