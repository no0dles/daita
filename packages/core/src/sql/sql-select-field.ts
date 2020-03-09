import {SqlFunction} from './sql-function';
import {SqlRawValue} from './sql-raw-value';
import {SqlSelect} from './sql-select';
import {SqlSchemaTableField} from './sql-schema-table-field';
import {SqlRawAliasValue} from './sql-raw-alias-value';
import {SqlAlias} from './sql-alias';
import {SqlSchemaTable} from './sql-schema-table';
import {SqlSelectAll} from './sql-select-all';

export type SqlSelectField =
  SqlFunction | SqlRawValue | SqlSelect | SqlSchemaTableField | (SqlSchemaTable & SqlSelectAll) | SqlSelectAll |
  (SqlFunction & SqlAlias) | (SqlSelect & SqlAlias) | (SqlSchemaTableField & SqlAlias) | SqlRawAliasValue;
