import { RelationalDataAdapter } from '../adapter';
import { isSqlSchemaTable } from '../sql/sql-schema-table';
import { RelationalSelectBuilder } from './relational-select-builder';
import { TableInformation } from '../table-information';

export function select<T>(
  dataAdapter: RelationalDataAdapter,
  table: TableInformation<T>,
): RelationalSelectBuilder<T> {
  if (typeof table === 'string') {
    return new RelationalSelectBuilder<T>(dataAdapter, {
      select: [],
      from: table,
    });
  } else if (isSqlSchemaTable(table)) {
    return new RelationalSelectBuilder<T>(dataAdapter, {
      select: [],
      from: table,
    });
  } else {
    return new RelationalSelectBuilder<T>(dataAdapter, {
      select: [],
      from: table.name,
    });
  }
}
