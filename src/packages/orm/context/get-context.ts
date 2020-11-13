import { TransactionContext } from './transaction-context';
import { RelationalTransactionContext } from './relational-transaction-context';
import { isRelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { MigrationContext } from './get-migration-context';
import { RelationalMigrationContext } from './relational-migration-context';
import { isRelationalMigrationAdapter } from '../adapter/relational-migration-adapter';
import { RelationalMigrationAdapterImplementation } from '../adapter/relational-migration-adapter-implementation';
import {
  RelationalDataAdapterImplementation,
  RelationalTransactionAdapterImplementation,
} from '../../relational/adapter/relational-adapter-implementation';
import { Context } from './context';
import { RelationalContext } from './relational-context';
import { MigrationTree } from '../migration/migration-tree';
import { isKind } from '../../common';
import { RuleContext } from '../../relational/permission/description/rule-context';

export interface ContextSchemaOptions {
  schema: OrmRelationalSchema;
  auth?: RuleContext;
}
export const isContextSchemaOptions = (val: ContextOptions): val is ContextSchemaOptions => isKind(val, ['schema']);
export interface ContextMigrationTreeOptions {
  migrationTree: MigrationTree;
  auth?: RuleContext;
}
export const isContextMigrationTreeOptions = (val: ContextOptions): val is ContextMigrationTreeOptions =>
  isKind(val, ['migrationTree']);
export type ContextOptions = ContextSchemaOptions | ContextMigrationTreeOptions;

export function getContext<TQuery, TOptions>(
  adapterImplementation: RelationalMigrationAdapterImplementation<TQuery, TOptions>,
  options: Partial<ContextSchemaOptions> & TOptions,
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
  const auth: RuleContext = options.auth || { isAuthorized: false };
  if (isRelationalMigrationAdapter(dataAdapter)) {
    return new RelationalMigrationContext(dataAdapter, migrationTree, auth);
  } else if (isRelationalTransactionAdapter(dataAdapter)) {
    return new RelationalTransactionContext(dataAdapter, migrationTree, auth);
  } else {
    return new RelationalContext(dataAdapter, migrationTree, auth);
  }
}
