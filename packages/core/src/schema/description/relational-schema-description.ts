import {SqlSchemaTable} from '../../sql';
import {TableInformation} from '../../context/table-information';
import {getSqlTable} from '../../builder/utils';
import {ArrayMap} from './array-map';
import {RelationalTableDescription} from './relational-table-description';

export class RelationalSchemaDescription {
  private readonly tableArrayMap: ArrayMap<RelationalTableDescription>;

  constructor() {
    this.tableArrayMap = new ArrayMap<RelationalTableDescription>();
  }

  private getKey(table: SqlSchemaTable) {
    return table.schema ? `${table.schema}.${table.table}` : table.table;
  }

  table(table: TableInformation<any>): RelationalTableDescription {
    const sqlTable = getSqlTable(table);
    const key = this.getKey(sqlTable);
    const tableDescription = this.tableArrayMap.get(key);
    if (!tableDescription) {
      throw new Error(`Unable to get table ${key} from schema`);
    }
    return tableDescription;
  }

  add(name: string, table: RelationalTableDescription) {
    this.tableArrayMap.add(name, table);
  }

  remove(table: string, schema?: string) {
    this.tableArrayMap.remove(this.getKey({table, schema}));
  }
}

