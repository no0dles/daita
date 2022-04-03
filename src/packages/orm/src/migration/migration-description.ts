import { MigrationStep } from './migration-step';

export interface MigrationDescription {
  id: string;
  steps: MigrationStep[];
  resolve?: string;
  after?: string;
}

export interface UpDownMigrationDescription<TSql> {
  id: string;
  resolve?: string;
  after?: string;
  up: (client: MigrationAdapter<TSql>) => void;
  down: (client: MigrationAdapter<TSql>) => void;
}

export interface MigrationAdapter<TSql> {
  exec(sql: TSql): void;
}

export type SchemaMigration<TSql> = MigrationDescription | UpDownMigrationDescription<TSql>;
