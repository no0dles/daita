import { CreateSchemaSql } from './create-schema-sql';
import { CreateTableSql } from './create-table-sql';
import { AlterTableSql } from './alter-table-sql';
import { DropTableSql } from './drop-table-sql';
import { LockTableSql } from './lock-table-sql';
import { InsertSql } from './insert-sql';
import { UpdateSql } from './update-sql';
import { DeleteSql } from './delete-sql';
import { SelectSql } from './select-sql';

export type Sql<T> = SelectSql<T> | DeleteSql | UpdateSql<T> | InsertSql<T> | LockTableSql | DropTableSql | AlterTableSql | CreateTableSql | CreateSchemaSql;