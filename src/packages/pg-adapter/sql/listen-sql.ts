import { isExactKind } from '../../common/utils';

export interface PostgresListenSql {
  listen: string;
}

export const isListenSql = (val: any): val is PostgresListenSql =>
  isExactKind<PostgresListenSql>(val, ['listen']);
