import { SqlSchemaTableField } from '../../sql-schema-table-field';
import { SqlSelectAll, SqlSelectDistinct } from '../select';
import { SqlSchemaTable } from '../../sql-schema-table';
import { isKind } from '@daita/common';

export interface SqlCountFunction {
  count:
    | SqlSchemaTableField
    | SqlSelectAll
    | (SqlSelectDistinct & SqlSchemaTableField)
    | (SqlSelectAll & SqlSchemaTable);
}

export const isSqlCountFunction = (val: any): val is SqlCountFunction =>
  isKind<SqlCountFunction>(val, ['count']);
