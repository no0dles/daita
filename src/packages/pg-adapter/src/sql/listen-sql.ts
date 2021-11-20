import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface PostgresListenSql {
  listen: string;
}

export const isListenSql = (val: any): val is PostgresListenSql => isExactKind<PostgresListenSql>(val, ['listen']);
