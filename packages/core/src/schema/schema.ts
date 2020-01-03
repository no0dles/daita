import {DocumentDataAdapter, RelationalDataAdapter, RelationalTransactionDataAdapter} from '../adapter';
import {Constructable, DefaultConstructable} from '../constructable';
import {DocumentContext, RelationalContext, RelationalTransactionContext} from '../context';
import {Doc} from '../context/types/document';
import {getMigrationSchema} from './migration-schema-builder';
import {MigrationDescription} from '../migration';
import {MigrationTree} from '../migration/migration-tree';
import {SchemaTableOptions} from './schema-table-options';
import {MigrationSchema} from './migration-schema';

export class RelationalSchema {
  private migrationTree = new MigrationTree();
  private tables: Constructable<any>[] = [];

  table<T extends { id: any }>(model: DefaultConstructable<T>): void
  table<T>(model: DefaultConstructable<T>, options: SchemaTableOptions<T>): void
  table<T>(model: DefaultConstructable<T>, options?: SchemaTableOptions<T>): void {
    this.tables.push(model);
  }

  migration(migrationType: DefaultConstructable<MigrationDescription>) {
    const migration = new migrationType();
    this.migrationTree.add(migration);
  }

  context(dataAdapter: RelationalDataAdapter, migrationId?: string): RelationalContext
  context(dataAdapter: RelationalTransactionDataAdapter, migrationId?: string): RelationalTransactionContext
  context(dataAdapter: RelationalDataAdapter | RelationalTransactionDataAdapter, migrationId?: string): RelationalContext | RelationalTransactionContext {
    if (this.migrationTree.migrationCount === 0) {
      const schema = getMigrationSchema([]);
      return this.getContext(schema, this.migrationTree, dataAdapter);
    }

    if (migrationId) {
      const path = this.migrationTree.path(migrationId);
      const schema = getMigrationSchema(path);
      return this.getContext(schema, this.migrationTree, dataAdapter);
    }


    const lastMigrations = this.migrationTree.last();
    if (lastMigrations.length > 1) {
      throw new Error(`has unresolved migrations`);
    }

    const path = this.migrationTree.path(lastMigrations[0].id);
    const schema = getMigrationSchema(path);

    return this.getContext(schema, this.migrationTree, dataAdapter);
  }

  private getContext(schema: MigrationSchema, migrationTree: MigrationTree, dataAdapter: RelationalDataAdapter | RelationalTransactionDataAdapter) {
    if (dataAdapter.kind === 'dataAdapter') {
      return new RelationalContext(schema, migrationTree, dataAdapter);
    } else {
      return new RelationalTransactionContext(schema, dataAdapter);
    }
  }
}

export class DocumentSchema {
  private migrationTree = new MigrationTree();
  private collections: Constructable<any>[] = [];

  collection(model: DefaultConstructable<Doc>) {
    this.collections.push(model);
  }

  migration(migrationType: DefaultConstructable<MigrationDescription>) {
    const migration = new migrationType();
    this.migrationTree.add(migration);
  }

  context(dataAdapter: DocumentDataAdapter): DocumentContext {
    if (this.migrationTree.migrationCount === 0) {
      const schema = getMigrationSchema([]);
      return new DocumentContext(schema, this.migrationTree, dataAdapter);
    }

    const lastMigrations = this.migrationTree.last();
    if (lastMigrations.length > 1) {
      throw new Error(`has unresolved migrations`);
    }

    const path = this.migrationTree.path(lastMigrations[0].id);
    const schema = getMigrationSchema(path);
    return new DocumentContext(schema, this.migrationTree, dataAdapter);
  }
}
