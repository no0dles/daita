import { isKind } from '@daita/common';

export interface SqlAlias {
  alias: string;
}

export const isSqlAlias = (val: any): val is SqlAlias =>
  isKind<SqlAlias>(val, ['alias']);
