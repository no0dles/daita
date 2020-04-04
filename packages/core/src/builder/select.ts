import {RelationalDataAdapter} from '../adapter';
import {TableInformation} from '../context/table-information';
import {isSqlSchemaTable} from '../sql/sql-schema-table';
import {RelationalSelectBuilder} from './relational-select-builder';


export function select<T>(dataAdapter: RelationalDataAdapter, table: TableInformation<T>): RelationalSelectBuilder<T> {
  if (typeof table === 'string') {
    return new RelationalSelectBuilder<T>(dataAdapter, table);
  } else if (isSqlSchemaTable(table)) {
    return new RelationalSelectBuilder<T>(dataAdapter, table);
  } else {
    return new RelationalSelectBuilder<T>(dataAdapter, table.name);
  }
}
