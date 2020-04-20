import { SqlValue } from '../sql-value';
import { isKind } from '@daita/common';

export interface SqlConcatFunction {
  concat: SqlValue[];
}

export const isSqlConcatFunction = (val: any): val is SqlConcatFunction =>
  isKind<SqlConcatFunction>(val, ['concat']);
