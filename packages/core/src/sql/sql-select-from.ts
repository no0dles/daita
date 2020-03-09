import {SqlTable} from './sql-table';
import {SqlSelect} from './sql-select';
import {SqlSchemaTable} from './sql-schema-table';
import {SqlAlias} from './sql-alias';

export type SqlSelectFrom = SqlTable | SqlSelect | (SqlSchemaTable & SqlAlias) | (SqlSelect & SqlAlias);