import {isKind} from '../../utils/is-kind';

export interface SqlSelectAll {
  all: true;
}

export const isSqlSelectAll = (val: any): val is SqlSelectAll => isKind<SqlSelectAll>(val, ['all']);