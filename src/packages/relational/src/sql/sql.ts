import { InsertSql } from './dml/insert/insert-sql';
import { UpdateSql } from './dml/update/update-sql';
import { DeleteSql } from './dml/delete/delete-sql';
import { SelectSql } from './dml/select/select-sql';

export type Sql<T> = SelectSql<T> | DeleteSql | UpdateSql<T> | InsertSql<T>;
