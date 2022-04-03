import { MigrationContextUpdateOptions } from './migration-context-update-options';
import { OrmRelationalSchema } from '../schema';
import { isMigrationTree, MigrationStorage, MigrationTree } from '../migration';
import { failNever, isKind } from '@daita/common';
import { RelationalOrmAdapter } from '../adapter';
import { doMigrate, needsMigration } from './utils';
import { RelationalAdapter } from '@daita/relational';

export interface MigrationContext<TSql> {
  needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean>;
  migrate(options?: MigrationContextUpdateOptions): Promise<void>;
  getMigrations(): Promise<MigrationTree<TSql>>;
}

export interface ContextSchemaOptions<TSql> {
  schema: OrmRelationalSchema<TSql>;
}
export const isContextSchemaOptions = (val: ContextOptions<any>): val is ContextSchemaOptions<any> =>
  isKind(val, ['schema']);

export interface ContextMigrationTreeOptions<TSql> {
  migrationTree: MigrationTree<TSql>;
}
export const isContextMigrationTreeOptions = (val: ContextOptions<any>): val is ContextMigrationTreeOptions<any> =>
  isKind(val, ['migrationTree']);

export type ContextOptions<TSql> =
  | ContextSchemaOptions<TSql>
  | ContextMigrationTreeOptions<TSql>
  | ContextSchemaNameOptions;

export interface ContextSchemaNameOptions {
  schemaName: string;
}

export const isContextSchemaNameOptions = (val: ContextOptions<any>): val is ContextSchemaNameOptions =>
  isKind(val, ['schemaName']);

export function getMigrationContext<TSql>(
  adapter: RelationalOrmAdapter & RelationalAdapter<TSql>,
  options: ContextOptions<TSql>,
): MigrationContext<TSql> {
  if (isContextSchemaOptions(options)) {
    return new RelationalMigrationContext(adapter, options.schema.getMigrations());
  } else if (isContextMigrationTreeOptions(options)) {
    return new RelationalMigrationContext(adapter, options.migrationTree);
  } else if (isContextSchemaNameOptions(options)) {
    return new RelationalSchemaContext(adapter, options.schemaName);
  } else {
    failNever(options, 'unsupported options');
  }
}

export async function migrate<TSql>(
  adapter: RelationalOrmAdapter & RelationalAdapter<TSql>,
  migrationTree: MigrationTree<TSql> | OrmRelationalSchema<TSql>,
  options?: MigrationContextUpdateOptions,
) {
  const ctx = getMigrationContext(
    adapter,
    isMigrationTree(migrationTree) ? { migrationTree: migrationTree } : { schema: migrationTree },
  );
  await ctx.migrate(options);
}

class RelationalSchemaContext<TSql> implements MigrationContext<TSql> {
  private readonly storage: MigrationStorage<TSql>;

  constructor(private adapter: RelationalOrmAdapter & RelationalAdapter<TSql>, private schemaName: string) {
    this.storage = new MigrationStorage<TSql>(adapter);
  }

  getMigrations(): Promise<MigrationTree<TSql>> {
    return this.storage.get(this.schemaName);
  }

  async migrate(options?: MigrationContextUpdateOptions): Promise<void> {
    return;
  }

  async needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean> {
    return false;
  }
}

class RelationalMigrationContext<TSql> implements MigrationContext<TSql> {
  private readonly storage: MigrationStorage<TSql>;

  constructor(
    private adapter: RelationalOrmAdapter & RelationalAdapter<TSql>,
    private migrationTree: MigrationTree<TSql>,
  ) {
    this.storage = new MigrationStorage<TSql>(adapter);
  }

  getMigrations(): Promise<MigrationTree<TSql>> {
    return this.storage.get(this.migrationTree.name);
  }

  async migrate(options?: MigrationContextUpdateOptions): Promise<void> {
    return doMigrate(this.storage, await this.migrationTree, options ?? {});
  }

  async needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean> {
    return needsMigration(this.storage, await this.migrationTree, options ?? {});
  }
}
