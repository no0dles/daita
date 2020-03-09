import {SqlFunction} from './sql-function';
import {SqlRawValue} from './sql-raw-value';
import {SqlSelect} from './sql-select';
import {SqlSchemaTableField} from './sql-schema-table-field';

export type SqlValue = SqlFunction | SqlRawValue | SqlSelect | SqlSchemaTableField;