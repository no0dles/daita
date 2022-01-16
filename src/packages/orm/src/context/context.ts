import { MigrationContextUpdateOptions } from './migration-context-update-options';
import { OrmRelationalSchema } from '../schema';
import { isMigrationTree, MigrationTree } from '../migration';
import { failNever, isKind } from '@daita/common';
import { RelationalOrmAdapter } from '../adapter';
import { doMigrate, needsMigration } from './utils';

export interface MigrationContext {
  needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean>;
  migrate(options?: MigrationContextUpdateOptions): Promise<void>;
  getMigrations(): Promise<MigrationTree>;
}

export interface ContextSchemaOptions {
  schema: OrmRelationalSchema;
}
export const isContextSchemaOptions = (val: ContextOptions): val is ContextSchemaOptions => isKind(val, ['schema']);

export interface ContextMigrationTreeOptions {
  migrationTree: MigrationTree;
}
export const isContextMigrationTreeOptions = (val: ContextOptions): val is ContextMigrationTreeOptions =>
  isKind(val, ['migrationTree']);

export type ContextOptions = ContextSchemaOptions | ContextMigrationTreeOptions | ContextSchemaNameOptions;

export interface ContextSchemaNameOptions {
  schemaName: string;
}

export const isContextSchemaNameOptions = (val: ContextOptions): val is ContextSchemaNameOptions =>
  isKind(val, ['schemaName']);

export function getMigrationContext(adapter: RelationalOrmAdapter, options: ContextOptions): MigrationContext {
  if (isContextSchemaOptions(options)) {
    return new RelationalMigrationContext(adapter, Promise.resolve(options.schema.getMigrations()));
  } else if (isContextSchemaNameOptions(options)) {
    return new RelationalMigrationContext(
      adapter,
      Promise.resolve(
        (async () => {
          const migrations = await adapter.getAppliedMigrations(options.schemaName);
          return new MigrationTree(options.schemaName, migrations);
        })(),
      ),
    );
  } else if (isContextMigrationTreeOptions(options)) {
    return new RelationalMigrationContext(adapter, Promise.resolve(options.migrationTree));
  } else {
    failNever(options, 'unsupported options');
  }
}

export async function migrate(
  adapter: RelationalOrmAdapter,
  migrationTree: MigrationTree | OrmRelationalSchema,
  options?: MigrationContextUpdateOptions,
) {
  const ctx = getMigrationContext(
    adapter,
    isMigrationTree(migrationTree) ? { migrationTree: migrationTree } : { schema: migrationTree },
  );
  await ctx.migrate(options);
}

class RelationalMigrationContext implements MigrationContext {
  constructor(private adapter: RelationalOrmAdapter, private migrationTree: Promise<MigrationTree>) {}

  getMigrations(): Promise<MigrationTree> {
    return this.migrationTree;
  }

  async migrate(options?: MigrationContextUpdateOptions): Promise<void> {
    return doMigrate(this.adapter, await this.migrationTree, options);
  }

  async needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean> {
    return needsMigration(this.adapter, await this.migrationTree, options);
  }
}
