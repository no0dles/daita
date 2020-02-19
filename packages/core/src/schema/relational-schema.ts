import {MigrationDescription, MigrationTree} from '../migration';
import {Constructable, DefaultConstructable} from '../constructable';
import {SchemaTableOptions} from './schema-table-options';
import {RelationalDataAdapter, RelationalTransactionDataAdapter} from '../adapter';
import {ContextUser} from '../auth';
import {RelationalContext, RelationalTransactionContext} from '../context';
import {MigrationSchema} from './migration-schema';
import {RelationalSchemaConstants, TableRule} from './schema';
import {PermissionBuilder} from '../permission';

export class RelationalSchema {
  private migrationTree = new MigrationTree();
  private tables: Constructable<any>[] = [];
  private permissions = new PermissionBuilder();

  constants: RelationalSchemaConstants = {
    username: {kind: 'username'},
    now: {kind: 'now'},
  };

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

  rule<T>(model: DefaultConstructable<T>, condition: TableRule<T>) {

  }

  permission(permissionBuilder: PermissionBuilder) {
    this.permissions.extend(permissionBuilder);
  }

  include(name: string, schema: RelationalSchema) {

  }

  context(
    dataAdapter: RelationalDataAdapter,
    options?: { migrationId?: string, user?: ContextUser },
  ): RelationalContext;
  context(
    dataAdapter: RelationalTransactionDataAdapter,
    options?: { migrationId?: string, user?: ContextUser },
  ): RelationalTransactionContext;
  context(
    dataAdapter: RelationalDataAdapter | RelationalTransactionDataAdapter,
    options?: { migrationId?: string, user?: ContextUser },
  ): RelationalContext | RelationalTransactionContext {
    const user = (options ? options.user : null) || null;
    const schema = this.migrationTree.defaultSchema(options ? options.migrationId : undefined);
    return this.getContext(schema, this.migrationTree, dataAdapter, user);
  }

  private getContext(
    schema: MigrationSchema,
    migrationTree: MigrationTree,
    dataAdapter: RelationalDataAdapter | RelationalTransactionDataAdapter,
    user: ContextUser | null,
  ) {
    if (dataAdapter.kind === 'dataAdapter') {
      return new RelationalContext(schema, migrationTree, dataAdapter, user);
    } else {
      return new RelationalTransactionContext(schema, dataAdapter, user);
    }
  }
}