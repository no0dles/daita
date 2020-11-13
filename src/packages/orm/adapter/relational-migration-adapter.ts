import { MigrationDescription } from '../migration/migration-description';
import { Client } from '../../relational/client/client';
import { RelationalDataAdapter, RelationalTransactionAdapter } from '../../relational';

export interface RelationalMigrationAdapter<TSql> extends RelationalTransactionAdapter<TSql> {
  getClient(handle: Promise<void>): Promise<Client<TSql>>;
  getAppliedMigrations(client: Client<TSql>, schema: string): Promise<MigrationDescription[]>;
  applyMigration(
    client: Client<TSql>,
    schema: string,
    migration: MigrationDescription,
    direction: MigrationDirection,
  ): Promise<void>;
  close(): Promise<void>;
}

export type MigrationDirection = 'forward' | 'reverse';

export const isRelationalMigrationAdapter = (
  val: RelationalDataAdapter<any> | RelationalMigrationAdapter<any> | RelationalTransactionAdapter<any>,
): val is RelationalMigrationAdapter<any> =>
  typeof (<any>val).applyMigration === 'function' && typeof (<any>val).getAppliedMigrations === 'function';
