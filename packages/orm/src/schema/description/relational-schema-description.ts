import { ArrayMap } from './array-map';
import { RelationalTableDescription } from './relational-table-description';
import { arrayClone } from '@daita/common';
import { TableDescription } from '@daita/relational';

export function getTableDescriptionIdentifier(table: TableDescription<any>): string {
  if (table.schema) {
    return `${table.schema}.${table.table}`;
  }
  return table.table;
}

export class RelationalSchemaDescription {
  private readonly tableArrayMap = new ArrayMap<RelationalTableDescription>();

  table(key: TableDescription<any>): RelationalTableDescription {
    const identifier = getTableDescriptionIdentifier(key);
    const tableDescription = this.tableArrayMap.get(identifier);
    if (!tableDescription) {
      throw new Error(`Unable to get table ${identifier} from schema`);
    }
    return tableDescription;
  }

  get tables() {
    return arrayClone(this.tableArrayMap.array);
  }

  containsTable(key: TableDescription<any>): boolean {
    return this.tableArrayMap.exists(getTableDescriptionIdentifier(key));
  }

  addTable(key: TableDescription<any>, description: RelationalTableDescription) {
    this.tableArrayMap.add(getTableDescriptionIdentifier(key), description);
  }

  removeTable(key: TableDescription<any>) {
    this.tableArrayMap.remove(getTableDescriptionIdentifier(key));
  }
}

