import { MigrationDescription } from '../migration/migration-description';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import { MigrationPlan } from '../context/relational-migration-context';

export interface RelationalMigrationAdapter<TSql> extends RelationalTransactionAdapter<TSql> {
  getAppliedMigrations(schema: string): Promise<MigrationDescription[]>;
  applyMigration(schema: string, migrationPlan: MigrationPlan[]): Promise<void>;
}

export type MigrationDirection = 'forward' | 'reverse';

export const isRelationalMigrationAdapter = (
  val: RelationalDataAdapter<any> | RelationalMigrationAdapter<any> | RelationalTransactionAdapter<any>,
): val is RelationalMigrationAdapter<any> =>
  typeof (<any>val).applyMigration === 'function' && typeof (<any>val).getAppliedMigrations === 'function';
