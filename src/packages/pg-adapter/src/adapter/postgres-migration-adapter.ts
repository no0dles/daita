import { RelationalMigrationAdapter } from '@daita/orm';
import { PostgresSql } from '../sql/postgres-sql';
import { MigrationDescription } from '@daita/orm';
import {
  ConnectionError,
  RelationalDataAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
  table,
} from '@daita/relational';
import { createLogger, failNever, handleTimeout, parseJson } from '@daita/common';
import { MigrationPlan } from '@daita/orm';
import { MigrationStorage } from '@daita/orm';
import { RelationalClient } from '@daita/relational';
import { Migrations } from '@daita/orm';
import { updateSeedAction } from '@daita/orm';
import { insertSeedAction } from '@daita/orm';
import { deleteSeedAction } from '@daita/orm';
import { dropViewAction } from '@daita/orm';
import { dropTableAction } from '@daita/orm';
import { addViewAction } from '@daita/orm';
import { dropTableField } from '@daita/orm';
import { addTableWithSchemaAction } from '@daita/orm';
import { addTableFieldAction } from '@daita/orm';
import { createIndexAction } from '@daita/orm';
import { alterViewAction } from '@daita/orm';
import { addTablePrimaryKeyAction } from '@daita/orm';
import { dropIndexAction } from '@daita/orm';
import { dropTableForeignKeyAction } from '@daita/orm';
import { addTableForeignKeyAction } from '@daita/orm';
import { dropTablePrimaryKeyAction } from '@daita/orm';
import { Client } from '@daita/relational';
import { RelationalTransactionClient } from '@daita/relational';
import { dropDatabase, ensureDatabaseExists, parseConnectionString } from '../postgres.util';
import { Pool, PoolClient, types } from 'pg';
import { exec, execRaw, PostgresDataAdapter } from './postgres-data-adapter';
import { postgresFormatter } from '../formatters';

export interface PostgresNotificationSubscriber {
  (msg: string | undefined): void;
}

export interface PostgresMigrationAdapterOptions {
  connectionString: string;
  listenForNotifications?: boolean;
  prepare?: () => Promise<void>;
  cleanup?: () => Promise<void>;
}

export class PostgresMigrationAdapter implements RelationalMigrationAdapter<PostgresSql> {
  private notificationPoolClient: PoolClient | undefined = undefined;
  private notificationPoolClientAdapter: RelationalDataAdapter<PostgresSql> | undefined = undefined;
  private notificationSubscribers: { [key: string]: PostgresNotificationSubscriber[] } = {};

  private closed = false;
  protected readonly logger = createLogger({ package: 'pg-adapter' });

  protected parseConnectionString = parseConnectionString(this.options.connectionString);
  protected pool = new Promise<Pool>((resolve) => {
    resolve(
      (async () => {
        if (this.options.prepare) {
          await this.options.prepare();
        }

        const pool = new Pool({
          connectionString: this.options.connectionString,
          keepAlive: true,
          max: 20,
          connectionTimeoutMillis: 10000,
          idleTimeoutMillis: 10000,
          application_name: 'daita',
          //idleTimeoutMillis: 0,
          //connectionTimeoutMillis: 0,
        });
        pool.on('error', (e) => {
          this.logger.error(e, { client: 'pool' });
        });

        if (this.options.listenForNotifications) {
          await this.listenForNotification(pool);
        }

        return pool;
      })(),
    );
  });

  private readonly migrationStorage = new MigrationStorage({
    idType: { type: 'string' },
    transactionClient: new RelationalTransactionClient(this),
  });

  constructor(protected options: PostgresMigrationAdapterOptions) {
    types.setTypeParser(types.builtins.NUMERIC, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.FLOAT4, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.FLOAT8, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.INT8, (val) => parseInt(val));
    types.setTypeParser(types.builtins.JSON, (val) => parseJson(val));
    types.setTypeParser(types.builtins.JSONB, (val) => parseJson(val));
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    return this.migrationStorage.get(schema);
  }

  async remove(): Promise<void> {
    this.checkForClosed();
    await dropDatabase(this.options.connectionString);
    await ensureDatabaseExists(this.options.connectionString);
  }

  private async applyMigrationPlan(client: Client<PostgresSql>, migrationPlan: MigrationPlan) {
    for (const step of migrationPlan.migration.steps) {
      if (step.kind === 'add_table') {
        await addTableWithSchemaAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_field') {
        await addTableFieldAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_primary_key') {
        await addTablePrimaryKeyAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_foreign_key') {
        await addTableForeignKeyAction(client, step);
      } else if (step.kind === 'drop_table_primary_key') {
        await dropTablePrimaryKeyAction(client, step);
      } else if (step.kind === 'drop_table') {
        await dropTableAction(client, step);
      } else if (step.kind === 'drop_table_field') {
        await dropTableField(client, step);
      } else if (step.kind === 'create_index') {
        await createIndexAction(client, step);
      } else if (step.kind === 'drop_index') {
        await dropIndexAction(client, step);
      } else if (step.kind === 'drop_table_foreign_key') {
        await dropTableForeignKeyAction(client, step);
      } else if (step.kind === 'add_rule') {
      } else if (step.kind === 'drop_rule') {
      } else if (step.kind === 'add_view') {
        await addViewAction(client, step);
      } else if (step.kind === 'alter_view') {
        await alterViewAction(client, step);
      } else if (step.kind === 'drop_view') {
        await dropViewAction(client, step);
      } else if (step.kind === 'insert_seed') {
        await insertSeedAction(client, step);
      } else if (step.kind === 'update_seed') {
        await updateSeedAction(client, step);
      } else if (step.kind === 'delete_seed') {
        await deleteSeedAction(client, step);
      } else {
        failNever(step, 'unknown migration step');
      }
    }
  }

  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    this.checkForClosed();
    await this.transaction(async (trx) => {
      const client = new RelationalClient(trx);
      await client.exec({ lockTable: table(Migrations) });
      await this.applyMigrationPlan(client, migrationPlan);
      await this.migrationStorage.add(client, schema, migrationPlan.migration);
      await client.exec({ notify: 'daita_migrations' });
    });
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    this.checkForClosed();
    return execRaw(this.logger, await this.pool, sql, values);
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    this.checkForClosed();
    return exec(this.logger, await this.pool, sql);
  }

  supportsQuery<S>(sql: S): this is RelationalTransactionAdapter<PostgresSql | S> {
    return postgresFormatter.canHandle(sql);
  }

  private async listenForNotification(pool: Pool) {
    await this.reconnectListener(pool);
  }

  private checkForClosed() {
    if (this.closed) {
      throw new Error('adapter is closed');
    }
  }

  private async reconnectListener(pool: Pool) {
    try {
      if (this.notificationPoolClient) {
        this.notificationPoolClient.release();
        this.notificationPoolClient = undefined;
        this.notificationPoolClientAdapter = undefined;
      }

      this.notificationPoolClient = await pool.connect();
      this.notificationPoolClient.on('error', (e) => {
        this.logger.error(e, { client: 'notification' });
        if (this.closed) {
          return;
        }
        this.reconnectListener(pool);
      });
      this.notificationPoolClientAdapter = new PostgresDataAdapter(this.notificationPoolClient);
      this.notificationPoolClient.on('notification', (msg) => {
        const subscribers = this.notificationSubscribers[msg.channel] ?? [];
        for (const subscriber of subscribers) {
          subscriber(msg.payload);
        }
      });
      for (const channel of Object.keys(this.notificationSubscribers)) {
        await this.notificationPoolClientAdapter.exec({ listen: channel });
      }
    } catch (e) {
      if (this.closed) {
        return;
      }

      setTimeout(() => {
        this.reconnectListener(pool);
      }, 2000);
    }
  }

  async addNotificationListener(channel: string, callback: PostgresNotificationSubscriber) {
    if (!this.notificationSubscribers[channel]) {
      this.notificationSubscribers[channel] = [];
    }
    this.notificationSubscribers[channel].push(callback);
    if (this.notificationPoolClientAdapter) {
      await this.notificationPoolClientAdapter.exec({ listen: channel });
    }
  }

  async removeNotificationListener(channel: string, callback: PostgresNotificationSubscriber) {
    if (!this.notificationSubscribers[channel]) {
      return;
    }
    const index = this.notificationSubscribers[channel].indexOf(callback);
    if (index >= 0) {
      this.notificationSubscribers[channel].splice(index, 1);
    }
    if (this.notificationSubscribers[channel].length === 0) {
      delete this.notificationSubscribers[channel];
      await this.notificationPoolClientAdapter?.exec({ unlisten: channel });
    }
  }

  async close() {
    if (this.closed) {
      return;
    }
    this.closed = true;

    if (this.notificationPoolClient) {
      await this.notificationPoolClient.release();
    }

    const pool = await this.pool;
    await pool.end();

    if (this.options.cleanup) {
      await this.options.cleanup();
    }
  }

  async transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>, timeout?: number): Promise<T> {
    this.checkForClosed();

    const pool = await this.pool;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const adapter = new PostgresDataAdapter(client);
      const result = await handleTimeout(() => action(adapter), timeout);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      if (e.errno === -111) {
        throw new ConnectionError('TODO', e); //TODO after connection string parsing
      }

      await client.query('ROLLBACK');
      throw e;
    } finally {
      client?.release();
    }
  }

  toString() {
    return 'postgres';
  }
}
