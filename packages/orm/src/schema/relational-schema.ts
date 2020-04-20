import {MigrationDescription, MigrationTree} from '../migration';
import {SchemaTableOptions} from './schema-table-options';
import {RelationalSchemaContext, RelationalTransactionContext} from '../context';
import {RelationalSchemaOptions} from './relational-schema-options';
import {RelationalSchemaContextOptions} from '../context/relational-schema-context-options';
import {RelationalDataContext} from '../context/relational-data-context';
import {RelationalSchemaMigrationContext} from '../context/relational-schema-migration-context';
import {RelationalSchemaTransactionContext} from '../context/relational-schema-transaction-context';
import {RelationalSchemaDescription} from './description/relational-schema-description';
import {
  RelationalAuthSchemaContext,
  RelationalAuthTransactionSchemaContext,
  SchemaPermissions
} from "../permission-builder";
import {
  RelationalDataAdapter, RelationalMigrationAdapter,
  RelationalTransactionAdapter,
  TablePermission
} from "@daita/relational";
import { Constructable, DefaultConstructable } from "@daita/common";

export class RelationalSchema {
  private migrationTree = new MigrationTree();
  private permissions = new SchemaPermissions();
  private tables: Constructable[] = [];

  schema: string | null = null;

  constructor(private options?: RelationalSchemaOptions) {
    if (options && options.schema) {
      this.schema = options.schema;
    }
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
    if (options?.permissions) {
      this.permissions.add(model, options.permissions);
    }
  }

  permission<T>(model: DefaultConstructable<T>, permission: TablePermission<T>) {
    this.permissions.add(model, [permission]);
  }

  migration(migration: MigrationDescription) {
    this.migrationTree.add(migration);
  }

  // rule<T>(model: DefaultConstructable<T>, condition: TableRule<T>) {
  //
  // }

  migrationSchema(options?: RelationalSchemaContextOptions): RelationalSchemaDescription {
    return this.migrationTree.defaultBackwardDescription(options ? options.migrationId : undefined);
  }

  context(
    dataAdapter: RelationalDataAdapter,
    options?: RelationalSchemaContextOptions,
  ): RelationalDataContext {
    const schema = this.migrationSchema(options);
    //TODO compare tables and permissions with migration state, warn for unmigrated
    if (options?.user) {
      return new RelationalAuthSchemaContext(dataAdapter, schema, schema.userPermissions(options.user).sqlPermissions());
    }
    return new RelationalSchemaContext(dataAdapter, schema);
  }

  transactionContext(
    dataAdapter: RelationalTransactionAdapter,
    options?: RelationalSchemaContextOptions): RelationalTransactionContext {
    const schema = this.migrationSchema(options);
    if (options?.user) {
      return new RelationalAuthTransactionSchemaContext(dataAdapter, schema, schema.userPermissions(options.user).sqlPermissions());
    }
    return new RelationalSchemaTransactionContext(dataAdapter, schema);
  }

  migrationContext(dataAdapter: RelationalMigrationAdapter) {
    return new RelationalSchemaMigrationContext(dataAdapter, this.migrationTree);
  }
}
