import {isSqlFunction, SqlFunction} from './sql-function';
import {isSqlRawValue, SqlRawValue} from './sql-raw-value';
import {isSqlSelect, SqlSelect} from './sql-select';
import {isSqlSchemaTableField, SqlSchemaTableField} from './sql-schema-table-field';

export type SqlValue = SqlFunction | SqlRawValue | SqlSelect | SqlSchemaTableField;

export const isSqlValue = (val: any): val is SqlValue => isSqlFunction(val) || isSqlRawValue(val) || isSqlSelect(val) || isSqlSchemaTableField(val);