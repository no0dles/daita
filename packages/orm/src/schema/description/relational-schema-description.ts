import {SqlSchemaTable} from '../../sql';
import {TableInformation} from '../../context/table-information';
import {getSqlTable} from '../../builder/utils';
import {ArrayMap} from './array-map';
import {RelationalTableDescription} from './relational-table-description';
import {SchemaPermissions} from '../../permission/permission-builder';
import {ContextUser} from '../../auth';
import {TablePermission} from '../../permission';

export class RelationalSchemaDescription {
  private readonly tableArrayMap = new ArrayMap<RelationalTableDescription>();
  private readonly schemaPermissions = new SchemaPermissions();

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

  addTable(name: string, table: RelationalTableDescription) {
    this.tableArrayMap.add(name, table);
  }

  removeTable(table: string, schema?: string) {
    this.tableArrayMap.remove(this.getKey({table, schema}));
  }

  userPermissions(user: ContextUser) {
    return this.schemaPermissions.userPermissions(user);
  }

  addPermission(schema: string | undefined, table: string, mappedName: string, permission: TablePermission<any>) {
    this.schemaPermissions.add({table: mappedName, schema}, [permission]);
  }

  removePermission(schema: string | undefined, table: string, mappedName: string, permission: TablePermission<any>) {
    this.schemaPermissions.remove({table: mappedName, schema}, [permission]);
  }
}

