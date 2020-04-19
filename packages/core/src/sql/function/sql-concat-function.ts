import { SqlValue } from '../sql-value';
import { isKind } from '../../utils/is-kind';

export interface SqlConcatFunction {
  concat: SqlValue[];
}

export const isSqlConcatFunction = (val: any): val is SqlConcatFunction =>
  isKind<SqlConcatFunction>(val, ['concat']);
