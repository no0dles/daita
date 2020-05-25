import { isSqlAlterTable, SqlAlterTableQuery } from './alter-table/alter-table-query';
import { isSqlCreateTable, SqlCreateTableQuery } from './create-table/create-table-query';
import { isSqlDropTable, SqlDropTableQuery } from './drop-table/drop-table-query';
import { isSqlCreateSchemaQuery, SqlCreateSchemaQuery } from './create-schema/create-schema-query';

export * from './sql-field-type';

export type SqlDdlQuery = SqlAlterTableQuery | SqlCreateSchemaQuery | SqlCreateTableQuery<any> | SqlDropTableQuery;

export const isSqlDdlQuery = (val: any) => isSqlCreateSchemaQuery(val) || isSqlAlterTable(val) || isSqlCreateTable(val) || isSqlDropTable(val);
