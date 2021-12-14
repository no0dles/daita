import { TransactionContext } from './transaction-context';
import { RelationalTransactionContext } from './relational-transaction-context';
import { isRelationalTransactionAdapter } from '@daita/relational';
import { OrmRelationalSchema } from '../schema';
import { MigrationContext } from './get-migration-context';
import { RelationalMigrationContext } from './relational-migration-context';
import { isRelationalMigrationAdapter } from '../adapter';
import { RelationalMigrationAdapterImplementation } from '../adapter';
import { RelationalDataAdapterImplementation, RelationalTransactionAdapterImplementation } from '@daita/relational';
import { Context } from './context';
import { RelationalContext } from './relational-context';
import { MigrationTree } from '../migration';
import { RuleContext } from '@daita/relational';
import { isKind } from '@daita/common';
import { Resolvable } from '@daita/common';

export interface ContextSchemaOptions {
  schema: OrmRelationalSchema;
  auth?: RuleContext;
}

export const isContextSchemaOptions = (val: ContextOptions): val is ContextSchemaOptions => isKind(val, ['schema']);

export interface ContextMigrationTreeOptions {
  migrationTree: MigrationTree;
}

export const isContextMigrationTreeOptions = (val: ContextOptions): val is ContextMigrationTreeOptions =>
  isKind(val, ['migrationTree']);
export type ContextOptions = ContextSchemaOptions | ContextMigrationTreeOptions;

export interface ContextSchemaNameOptions {
  schemaName: string;
}

export type MigrationContextOptions = ContextOptions | ContextSchemaNameOptions;
export const isContextSchemaNameOptions = (val: MigrationContextOptions): val is ContextSchemaNameOptions =>
  isKind(val, ['schemaName']);

export function getContext<TQuery, TOptions>(
  adapterImplementation: RelationalMigrationAdapterImplementation<TQuery, TOptions>,
  options: MigrationContextOptions & TOptions,
): MigrationContext<TQuery>;
export function getContext<TQuery, TOptions>(
  adapterImplementation: RelationalTransactionAdapterImplementation<TQuery, TOptions>,
  options: ContextOptions & TOptions,
): TransactionContext<TQuery>;
export function getContext<TQuery, TOptions>(
  adapterImplementation: RelationalDataAdapterImplementation<TQuery, TOptions>,
  options: ContextOptions & TOptions,
): Context<TQuery>;
export function getContext<TQuery, TOptions>(
  adapterImplementation:
    | RelationalMigrationAdapterImplementation<TQuery, TOptions>
    | RelationalTransactionAdapterImplementation<TQuery, TOptions>
    | RelationalDataAdapterImplementation<TQuery, TOptions>,
  options: ContextOptions & TOptions,
): MigrationContext<TQuery> | TransactionContext<TQuery> | Context<TQuery> {
  const dataAdapter = adapterImplementation.getRelationalAdapter(options);
  const migrationTree = isContextSchemaOptions(options) ? options.schema.getMigrations() : options.migrationTree;
  if (isRelationalMigrationAdapter(dataAdapter)) {
    if (!migrationTree) {
      if (isContextSchemaNameOptions(options)) {
        const migrationResolvable = new Resolvable(async () => {
          const migrations = await dataAdapter.getAppliedMigrations(options.schemaName);
          return new MigrationTree(options.schemaName, migrations);
        });
        return new RelationalMigrationContext(dataAdapter, migrationResolvable);
      } else {
        throw new Error('unsupported options'); // TODO improve typing to remove this
      }
    } else {
      return new RelationalMigrationContext(dataAdapter, new Resolvable<MigrationTree>(migrationTree));
    }
  } else if (isRelationalTransactionAdapter(dataAdapter)) {
    return new RelationalTransactionContext(dataAdapter, new Resolvable<MigrationTree>(migrationTree));
  } else {
    return new RelationalContext(dataAdapter, new Resolvable<MigrationTree>(migrationTree));
  }
}
