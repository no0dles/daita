import {isKind} from '../utils/is-kind';

export interface SqlAlias {
  alias: string
}

export const isSqlAlias = (val: any): val is SqlAlias => isKind<SqlAlias>(val, ['alias']);