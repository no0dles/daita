import { TableDescription } from './description';
import { SelectSql } from './select-sql';

export interface CreateViewSql<T> {
  createView: TableDescription<T>;
  orReplace?: boolean;
  as: SelectSql<T>;
}
