import {SqlSelect} from './sql-select';
import {SqlAlias} from './sql-alias';
import {SqlSchemaTable} from '../sql-schema-table';
import {SqlTable} from '../sql-table';

export type SqlSelectFrom = SqlTable | SqlSelect | (SqlSchemaTable & SqlAlias) | (SqlSelect & SqlAlias);