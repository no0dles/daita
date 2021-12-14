import { MigrationDescription } from '../migration/migration-description';
import { RelationalTransactionAdapter } from '@daita/relational';
import { RelationalDataAdapter } from '@daita/relational';
import { MigrationPlan } from '../context/migration-plan';

export interface RelationalMigrationAdapter<TSql> extends RelationalTransactionAdapter<TSql> {
  getAppliedMigrations(schema: string): Promise<MigrationDescription[]>;
  applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void>;
  remove(): Promise<void>;
}

export type MigrationDirection = 'forward' | 'reverse';

export const isRelationalMigrationAdapter = (
  val: RelationalDataAdapter<any> | RelationalMigrationAdapter<any> | RelationalTransactionAdapter<any>,
): val is RelationalMigrationAdapter<any> =>
  typeof (<any>val).applyMigration === 'function' && typeof (<any>val).getAppliedMigrations === 'function';
