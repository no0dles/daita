import { MigrationDescription } from './migration-description';
import { Rule } from '../../relational/permission/description/rule';
import { Client } from '../../relational/client/client';

export interface MigrationAdapter<TSql> {
  getClient(handle: Promise<void>): Promise<Client<TSql>>;
  getAppliedMigrations(client: Client<TSql>, schema: string): Promise<MigrationDescription[]>;
  applyMigration(
    client: Client<TSql>,
    schema: string,
    migration: MigrationDescription,
    direction: MigrationDirection,
  ): Promise<void>;
  getRules(): Promise<Rule[]>;
  close(): Promise<void>;
}

export type MigrationDirection = 'forward' | 'reverse';
