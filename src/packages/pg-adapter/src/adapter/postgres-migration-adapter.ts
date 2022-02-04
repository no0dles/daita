import { PostgresSql } from '../sql';
import { MigrationDescription, RelationalOrmAdapter } from '@daita/orm';
import {
  BaseRelationalAdapter,
  ConnectionError,
  RelationalAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
  table,
} from '@daita/relational';
import { createLogger, failNever, parseJson } from '@daita/common';
import { MigrationPlan } from '@daita/orm';
import { MigrationStorage } from '@daita/orm';
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
import { parseConnectionString } from '../postgres.util';
import { Pool, PoolClient, types } from 'pg';
import { exec, execRaw, PostgresTransactionAdapter } from './postgres-transaction-adapter';
import { postgresFormatter } from '../formatters';
import { isPostgresError } from './postgres-error';

export interface PostgresNotificationSubscriber {
  (msg: string | undefined): void;
}

export interface PostgresMigrationAdapterOptions {
  connectionString: string;
  listenForNotifications?: boolean;
  prepare?: () => Promise<void>;
  cleanup?: () => Promise<void>;
}

export class PostgresMigrationAdapter
  extends BaseRelationalAdapter
  implements RelationalAdapter<PostgresSql>, RelationalOrmAdapter
{
  private notificationPoolClient: PoolClient | undefined = undefined;
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

  private readonly migrationStorage = new MigrationStorage(this, {
    idType: { type: 'string' },
  });

  constructor(protected options: PostgresMigrationAdapterOptions) {
    super();
    types.setTypeParser(types.builtins.NUMERIC, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.FLOAT4, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.FLOAT8, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.INT8, (val) => parseInt(val));
    types.setTypeParser(types.builtins.JSON, (val) => parseJson(val));
    types.setTypeParser(types.builtins.JSONB, (val) => parseJson(val));
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    await this.migrationStorage.initialize();
    return this.migrationStorage.get(schema);
  }

  private applyMigrationPlan(client: RelationalTransactionAdapter<PostgresSql>, migrationPlan: MigrationPlan) {
    for (const step of migrationPlan.migration.steps) {
      if (step.kind === 'add_table') {
        addTableWithSchemaAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_field') {
        addTableFieldAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_primary_key') {
        addTablePrimaryKeyAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_foreign_key') {
        addTableForeignKeyAction(client, step);
      } else if (step.kind === 'drop_table_primary_key') {
        dropTablePrimaryKeyAction(client, step);
      } else if (step.kind === 'drop_table') {
        dropTableAction(client, step);
      } else if (step.kind === 'drop_table_field') {
        dropTableField(client, step);
      } else if (step.kind === 'create_index') {
        createIndexAction(client, step);
      } else if (step.kind === 'drop_index') {
        dropIndexAction(client, step);
      } else if (step.kind === 'drop_table_foreign_key') {
        dropTableForeignKeyAction(client, step);
      } else if (step.kind === 'add_rule') {
      } else if (step.kind === 'drop_rule') {
      } else if (step.kind === 'add_view') {
        addViewAction(client, step);
      } else if (step.kind === 'alter_view') {
        alterViewAction(client, step);
      } else if (step.kind === 'drop_view') {
        dropViewAction(client, step);
      } else if (step.kind === 'insert_seed') {
        insertSeedAction(client, step);
      } else if (step.kind === 'update_seed') {
        updateSeedAction(client, step);
      } else if (step.kind === 'delete_seed') {
        deleteSeedAction(client, step);
      } else {
        failNever(step, 'unknown migration step');
      }
    }
  }

  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    this.checkForClosed();
    await this.migrationStorage.initialize();
    await this.transaction(async (trx) => {
      trx.exec({ lockTable: table(Migrations) });
      this.applyMigrationPlan(trx, migrationPlan);
      this.migrationStorage.add(trx, schema, migrationPlan.migration);
      trx.exec({ notify: 'daita_migrations' });
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

  supportsQuery<S>(sql: S): this is RelationalAdapter<PostgresSql | S> {
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
      }

      this.notificationPoolClient = await pool.connect();
      this.notificationPoolClient.on('error', (e) => {
        this.logger.error(e, { client: 'notification' });
        if (this.closed) {
          return;
        }
        this.reconnectListener(pool);
      });
      this.notificationPoolClient.on('notification', (msg) => {
        const subscribers = this.notificationSubscribers[msg.channel] ?? [];
        for (const subscriber of subscribers) {
          subscriber(msg.payload);
        }
      });
      for (const channel of Object.keys(this.notificationSubscribers)) {
        await exec(this.logger, this.notificationPoolClient, { listen: channel });
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
    if (this.notificationPoolClient) {
      await exec(this.logger, this.notificationPoolClient, { listen: channel });
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
      if (this.notificationPoolClient) {
        await exec(this.logger, this.notificationPoolClient, { unlisten: channel });
      }
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

  async transaction(action: (adapter: RelationalTransactionAdapter<PostgresSql>) => void): Promise<void> {
    this.checkForClosed();

    const pool = await this.pool;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const adapter = new PostgresTransactionAdapter(client);
      action(adapter);
      await adapter.run();
      await client.query('COMMIT');
    } catch (e) {
      if (isPostgresError(e) && e.errno === -111) {
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
