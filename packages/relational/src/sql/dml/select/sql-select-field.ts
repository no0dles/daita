import { SqlSelect } from './sql-select';
import { SqlAlias } from './sql-alias';
import { SqlSelectAll } from './sql-select-all';
import { SqlRawValue } from '../sql-raw-value';
import { SqlSchemaTableField } from '../../sql-schema-table-field';
import { SqlSchemaTable } from '../../sql-schema-table';
import { SqlRawAliasValue } from '../sql-raw-alias-value';
import { SqlFunction } from '../function';

export type SqlSelectField =
  | SqlFunction
  | SqlRawValue
  | SqlSelect
  | SqlSchemaTableField
  | (SqlSchemaTable & SqlSelectAll)
  | SqlSelectAll
  | (SqlFunction & SqlAlias)
  | (SqlSelect & SqlAlias)
  | (SqlSchemaTableField & SqlAlias)
  | SqlRawAliasValue;
