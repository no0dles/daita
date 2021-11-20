import { TableDescription } from '@daita/relational';

export interface RelationalMapper {
  normalizeData<T>(table: TableDescription<T>, data: T[]): T[];
  normalizeSql<T>(sql: T): T;
}
