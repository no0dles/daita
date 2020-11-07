import { TableDescription } from '../../relational/sql/keyword/table/table-description';

export interface RelationalMapper {
  normalizeData<T>(table: TableDescription<T>, data: T[]): T[];
  normalizeSql<T>(sql: T): T;
}
