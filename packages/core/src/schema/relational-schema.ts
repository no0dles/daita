import {MigrationDescription, MigrationTree} from '../migration';
import {Constructable, DefaultConstructable} from '../constructable';
import {SchemaTableOptions} from './schema-table-options';
import {RelationalDataAdapter, RelationalTransactionAdapter} from '../adapter';
import {RelationalContext, RelationalTransactionContext} from '../context';
import {PermissionBuilder} from '../permission';
import {RelationalSchemaOptions} from './relational-schema-options';
import {RelationalSchemaContextOptions} from '../context/relational-schema-context-options';
import {RelationalMigrationAdapter} from '../adapter/relational-migration-adapter';
import {RelationalDataContext} from '../context/relational-data-context';
import {RelationalMigrationContext} from '../context/relational-migration-context';

export class RelationalSchema {
  private migrationTree = new MigrationTree();
  private tables: Constructable<any>[] = [];
  private permissions = new PermissionBuilder();

  constructor(private options?: RelationalSchemaOptions) {
  }

  table<T extends { id: any }>(model: DefaultConstructable<T>): void;
  table<T>(
    model: DefaultConstructable<T>,
    options: SchemaTableOptions<T>,
  ): void;
  table<T>(
    model: DefaultConstructable<T>,
    options?: SchemaTableOptions<T>,
  ): void {
    this.tables.push(model);
  }

  migration(migration: MigrationDescription) {
    this.migrationTree.add(migration);
  }

  // rule<T>(model: DefaultConstructable<T>, condition: TableRule<T>) {
  //
  // }

  permission(permissionBuilder: PermissionBuilder) {
    this.permissions.extend(permissionBuilder);
  }

  context(
    dataAdapter: RelationalMigrationAdapter,
    options?: RelationalSchemaContextOptions,
  ): RelationalMigrationContext;
  context(
    dataAdapter: RelationalTransactionAdapter,
    options?: RelationalSchemaContextOptions,
  ): RelationalTransactionContext;
  context(
    dataAdapter: RelationalDataAdapter,
    options?: RelationalSchemaContextOptions,
  ): RelationalDataContext;
  context(
    dataAdapter: RelationalDataAdapter | RelationalTransactionAdapter | RelationalMigrationAdapter,
    options?: RelationalSchemaContextOptions,
  ): RelationalDataContext | RelationalTransactionContext | RelationalMigrationContext {
    const user = (options ? options.user : null) || null;
    const schema = this.migrationTree.defaultSchema(options ? options.migrationId : undefined);
    return new RelationalContext(dataAdapter, schema, this.migrationTree, user);
  }
}