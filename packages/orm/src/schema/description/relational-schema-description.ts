import { TableInformation } from '../../context/table-information';
import { ArrayMap } from './array-map';
import { RelationalTableDescription } from './relational-table-description';
import { ContextUser } from '../../auth';
import { getSqlTableIdentifier, TablePermission } from '@daita/relational';
import { SchemaPermissions } from '../../permission-builder';
import { arrayClone } from '@daita/common';

export class RelationalSchemaDescription {
  private readonly tableArrayMap = new ArrayMap<RelationalTableDescription>();
  public readonly schemaPermissions = new SchemaPermissions();

  table(table: TableInformation<any>): RelationalTableDescription {
    const key = getSqlTableIdentifier(table);
    const tableDescription = this.tableArrayMap.get(key);
    if (!tableDescription) {
      throw new Error(`Unable to get table ${key} from schema`);
    }
    return tableDescription;
  }

  get tables() {
    return arrayClone(this.tableArrayMap.array);
  }

  containsTable(table: TableInformation<any>): boolean {
    const key = getSqlTableIdentifier(table);
    return this.tableArrayMap.exists(key);
  }

  addTable(name: string, table: RelationalTableDescription) {
    this.tableArrayMap.add(name, table);
  }

  removeTable(table: string, schema?: string) {
    this.tableArrayMap.remove(getSqlTableIdentifier({ table, schema }));
  }

  userPermissions(user: ContextUser) {
    return this.schemaPermissions.userPermissions(user);
  }

  addPermission(schema: string | undefined, table: string, mappedName: string, permission: TablePermission<any>) {
    this.schemaPermissions.add({ table: mappedName, schema }, [permission]);
  }

  removePermission(schema: string | undefined, table: string, mappedName: string, permission: TablePermission<any>) {
    this.schemaPermissions.remove({ table: mappedName, schema }, [permission]);
  }
}

