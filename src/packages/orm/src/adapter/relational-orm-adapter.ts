import { MigrationDescription } from '../migration/migration-description';
import { MigrationPlan } from '../context/migration-plan';

export interface RelationalOrmAdapter {
  getAppliedMigrations(schema: string): Promise<MigrationDescription[]>;
  applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void>;
}

export const isOrmAdapter = (val: any): val is RelationalOrmAdapter =>
  !!val && typeof val.getAppliedMigrations === 'function' && typeof val.applyMigration === 'function';

export type MigrationDirection = 'forward' | 'reverse';
