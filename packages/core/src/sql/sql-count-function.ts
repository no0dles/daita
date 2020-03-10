import {SqlSelectAll} from './sql-select-all';
import {SqlSelectDistinct} from './sql-select-distinct';
import {SqlSchemaTableField} from './sql-schema-table-field';
import {SqlSchemaTable} from './sql-schema-table';
import {isKind} from '../utils/is-kind';

export interface SqlCountFunction {
  count: SqlSchemaTableField | SqlSelectAll | (SqlSelectDistinct & SqlSchemaTableField) | (SqlSelectAll & SqlSchemaTable);
}

export const isSqlCountFunction = (val: any): val is SqlCountFunction => isKind<SqlCountFunction>(val, ['count']);