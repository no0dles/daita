import {SqlSelectAll} from './sql-select-all';
import {SqlSelectDistinct} from './sql-select-distinct';
import {SqlSchemaTableField} from './sql-schema-table-field';
import {SqlSchemaTable} from './sql-schema-table';

export interface SqlCountFunction {
  count: SqlSchemaTableField | SqlSelectAll | (SqlSelectDistinct & SqlSchemaTableField) | (SqlSelectAll & SqlSchemaTable);
}
