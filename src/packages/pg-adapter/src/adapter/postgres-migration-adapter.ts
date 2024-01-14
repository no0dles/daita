import { PostgresSql } from '../sql';
import { RelationalOrmAdapter, SchemaTableFieldTypeDescription } from '@daita/orm';
import {
  BaseRelationalAdapter,
  ConnectionError,
  RelationalAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
} from '@daita/relational';
import { createLogger, parseJson } from '@daita/common';
import { parseConnectionString } from '../postgres.util';
import { Pool, PoolClient, types } from 'pg';
import { exec, execRaw, PostgresTransactionAdapter } from './postgres-transaction-adapter';
import { postgresFormatter } from '../formatters';
import { isPostgresError } from './postgres-error';
import { SchemaDataType } from '@daita/orm';

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

  private parseConnectionString = parseConnectionString(this.options.connectionString);
  private pool = new Promise<Pool>((resolve) => {
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

  constructor(protected options: PostgresMigrationAdapterOptions) {
    super();
    types.setTypeParser(types.builtins.NUMERIC, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.FLOAT4, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.FLOAT8, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.INT8, (val) => parseInt(val));
    types.setTypeParser(types.builtins.JSON, (val) => parseJson(val));
    types.setTypeParser(types.builtins.JSONB, (val) => parseJson(val));
  }

  getDatabaseType(type: SchemaTableFieldTypeDescription, size?: string): string {
    switch (type) {
      case 'string':
        if (size) {
          return `VARCHAR(${size})`;
        } else {
          return 'VARCHAR';
        }
      case 'number':
        if (size) {
          return `NUMERIC(${size})`;
        } else {
          return 'NUMERIC(26,10)';
        }
      case 'date':
        return 'TIMESTAMPTZ';
      case 'boolean':
        return 'BOOLEAN';
      case 'json':
        return 'JSONB';
      case 'number[]':
        if (size) {
          return `NUMERIC(${size})[]`;
        } else {
          return 'NUMERIC(26,10)[]';
        }
      case 'string[]':
        if (size) {
          return `VARCHAR(${size})[]`;
        } else {
          return 'VARCHAR[]';
        }
      case 'boolean[]':
        return 'BOOLEAN[]';
      case 'uuid':
        return 'uuid';
    }

    throw new Error(`unknown data type ${type}`);
  }

  getSchemaType(value: string): SchemaDataType {
    const types: { regexp: RegExp; fn: (match: RegExpExecArray) => SchemaDataType }[] = [
      {
        regexp: /^uuid$/i,
        fn: (match) => ({ type: 'uuid' }),
      },
      {
        regexp: /^json(b?)$/i,
        fn: (match) => ({ type: 'json' }),
      },
      {
        regexp: /^timestamp(tz?)$/i,
        fn: (match) => ({ type: 'date' }),
      },
      {
        regexp: /^varchar(\((?<size>\d+)\)?)$/i,
        fn: (match) => (match.groups?.size ? { type: 'string', size: match.groups.size } : { type: 'string' }),
      },
      {
        regexp: /^numeric(\((?<size>\d+)\)?)$/i,
        fn: (match) => (match.groups?.size ? { type: 'number', size: match.groups.size } : { type: 'number' }),
      },
      {
        regexp: /^boolean$/i,
        fn: (match) => ({ type: 'boolean' }),
      },
      {
        regexp: /^varchar(\((?<size>\d+)\)?)\[\]$/i,
        fn: (match) => (match.groups?.size ? { type: 'string[]', size: match.groups.size } : { type: 'string[]' }),
      },
      {
        regexp: /^numeric(\((?<size>\d+)\)?)\[\]$/i,
        fn: (match) => (match.groups?.size ? { type: 'number[]', size: match.groups.size } : { type: 'number[]' }),
      },
      {
        regexp: /^boolean\[\]$/i,
        fn: (match) => ({ type: 'boolean[]' }),
      },
    ];

    for (const type of types) {
      const match = type.regexp.exec(value);
      if (match) {
        return type.fn(match);
      }
    }

    throw new Error(`unknown schema type ${value}`);
  }

  // async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
  //   await this.migrationStorage.initialize();
  //   return this.migrationStorage.get(schema);
  // }

  // private applyMigrationPlan(migrationPlan: MigrationPlan): PostgresSql[] {
  //   const schemas = new Set<string>();
  //   const result: PostgresSql[] = [];
  //
  //   for (const step of migrationPlan.migration.steps) {
  //     if ((step.kind === 'create_index' || step.kind === 'add_table' || step.kind === 'add_view') && step.schema) {
  //       schemas.add(step.schema);
  //     }
  //   }
  //
  //   for (const schema of schemas) {
  //     result.push({
  //       createSchema: schema,
  //       ifNotExists: true,
  //     });
  //   }
  //
  //   for (const step of migrationPlan.migration.steps) {
  //     if (step.kind === 'add_table') {
  //       result.push(addTableAction(step, migrationPlan.migration));
  //     } else if (step.kind === 'add_table_field') {
  //       if (hasAddTableStep(migrationPlan.migration, step)) {
  //         continue;
  //       }
  //
  //       result.push(addTableFieldAction(step));
  //     } else if (step.kind === 'add_table_primary_key') {
  //       if (hasAddTableStep(migrationPlan.migration, step)) {
  //         continue;
  //       }
  //
  //       result.push(addTablePrimaryKeyAction(step));
  //     } else if (step.kind === 'add_table_foreign_key') {
  //       if (hasAddTableStep(migrationPlan.migration, step)) {
  //         continue;
  //       }
  //
  //       result.push(addTableForeignKeyAction(step));
  //     } else if (step.kind === 'drop_table_primary_key') {
  //       result.push(dropTablePrimaryKeyAction(step));
  //     } else if (step.kind === 'drop_table') {
  //       result.push(dropTableAction(step));
  //     } else if (step.kind === 'drop_table_field') {
  //       result.push(dropTableField(step));
  //     } else if (step.kind === 'create_index') {
  //       result.push(createIndexAction(step));
  //     } else if (step.kind === 'drop_index') {
  //       result.push(dropIndexAction(step));
  //     } else if (step.kind === 'drop_table_foreign_key') {
  //       result.push(dropTableForeignKeyAction(step));
  //     } else if (step.kind === 'add_rule') {
  //     } else if (step.kind === 'drop_rule') {
  //     } else if (step.kind === 'add_view') {
  //       result.push(addViewAction(step));
  //     } else if (step.kind === 'alter_view') {
  //       result.push(alterViewAction(step));
  //     } else if (step.kind === 'drop_view') {
  //       result.push(dropViewAction(step));
  //     } else if (step.kind === 'insert_seed') {
  //       result.push(insertSeedAction(step));
  //     } else if (step.kind === 'update_seed') {
  //       result.push(updateSeedAction(step));
  //     } else if (step.kind === 'delete_seed') {
  //       result.push(deleteSeedAction(step));
  //     } else {
  //       failNever(step, 'unknown migration step');
  //     }
  //   }
  //
  //   return orderSqls(result);
  // }

  // async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
  //   this.checkForClosed();
  //   await this.migrationStorage.initialize();
  //   await this.transaction(async (trx) => {
  //     trx.exec({ lockTable: table(Migrations) });
  //     const sqls = this.applyMigrationPlan(migrationPlan);
  //     for (const sql of sqls) {
  //       trx.exec(sql);
  //     }
  //     this.migrationStorage.add(trx, schema, migrationPlan.migration);
  //     trx.exec({ notify: 'daita_migrations' });
  //   });
  // }

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
