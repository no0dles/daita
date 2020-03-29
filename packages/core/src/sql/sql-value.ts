import {isSqlRawValue, SqlRawValue} from './sql-raw-value';
import {isSqlSelect, SqlSelect} from './select/sql-select';
import {isSqlSchemaTableField, SqlSchemaTableField} from './sql-schema-table-field';
import {SqlFunction} from './function';
import {isSqlFunction} from './function/sql-function';

export type SqlValue = SqlFunction | SqlRawValue | SqlSelect | SqlSchemaTableField;

export const isSqlValue = (val: any): val is SqlValue => isSqlFunction(val) || isSqlRawValue(val) || isSqlSelect(val) || isSqlSchemaTableField(val);