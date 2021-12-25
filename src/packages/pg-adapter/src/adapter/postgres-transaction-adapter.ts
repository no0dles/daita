import { Pool, PoolClient, types } from 'pg';
import { PostgresDataAdapter } from './postgres-data-adapter';
import { PostgresSql } from '../sql/postgres-sql';
import { RelationalRawResult, RelationalTransactionAdapter } from '@daita/relational';
import { RelationalDataAdapter } from '@daita/relational';
import { ConnectionError } from '@daita/relational';
import { parseJson, Resolvable } from '@daita/common';
import { createLogger } from '@daita/common';
import { handleTimeout } from '@daita/common';
import { ParsedConnectionString, parseConnectionString } from '../postgres.util';
import { postgresFormatter } from '../formatters';

export interface PostgresNotificationSubscriber {
  (msg: string | undefined): void;
}

const logger = createLogger({ package: 'pg-adapter' });

export class PostgresTransactionAdapter implements RelationalTransactionAdapter<PostgresSql> {
  private closed = false;
  protected readonly logger = createLogger({ package: 'pg-adapter' });
  protected parseConnectionString = new Resolvable<ParsedConnectionString>(async () => {
    const connectionString = await this.connectionString.get();
    return parseConnectionString(connectionString);
  });
  protected pool = new Resolvable<Pool>(
    async () => {
      const connectionString = await this.connectionString.get();
      const pool = new Pool({
        connectionString,
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
      return pool;
    },
    (pool) => {
      pool?.end();
      return this.connectionString.close();
    },
  );

  private notificationPoolClient: PoolClient | undefined = undefined;
  private notificationPoolClientAdapter: RelationalDataAdapter<PostgresSql> | undefined = undefined;
  private notificationSubscribers: { [key: string]: PostgresNotificationSubscriber[] } = {};

  constructor(protected connectionString: Resolvable<string>) {
    types.setTypeParser(types.builtins.NUMERIC, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.FLOAT4, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.FLOAT8, (val) => parseFloat(val));
    types.setTypeParser(types.builtins.INT8, (val) => parseInt(val));
    types.setTypeParser(types.builtins.JSON, (val) => parseJson(val));
    types.setTypeParser(types.builtins.JSONB, (val) => parseJson(val));
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const adapter = new PostgresDataAdapter(await this.pool.get());
    return adapter.execRaw(sql, values);
  }

  async exec(sql: PostgresSql): Promise<RelationalRawResult> {
    const adapter = new PostgresDataAdapter(await this.pool.get());
    return adapter.exec(sql);
  }

  supportsQuery<S>(sql: S): this is RelationalTransactionAdapter<PostgresSql | S> {
    return postgresFormatter.canHandle(sql);
  }

  private async listenForNotification() {
    await this.reconnectListener();
  }

  private async reconnectListener() {
    try {
      if (this.notificationPoolClient) {
        this.notificationPoolClient.release();
        this.notificationPoolClient = undefined;
        this.notificationPoolClientAdapter = undefined;
      }

      const pool = await this.pool.get();
      this.notificationPoolClient = await pool.connect();
      this.notificationPoolClient.on('error', (e) => {
        logger.error(e, { client: 'notification' });
      });
      this.notificationPoolClientAdapter = new PostgresDataAdapter(this.notificationPoolClient);
      this.notificationPoolClient.on('notification', (msg) => {
        const subscribers = this.notificationSubscribers[msg.channel] ?? [];
        for (const subscriber of subscribers) {
          subscriber(msg.payload);
        }
      });
      this.notificationPoolClient.on('error', (err) => {
        this.logger.trace(err);
        if (this.closed) {
          return;
        }
        this.reconnectListener();
      });
      for (const channel of Object.keys(this.notificationSubscribers)) {
        await this.notificationPoolClientAdapter.exec({ listen: channel });
      }
    } catch (e) {
      if (this.closed) {
        return;
      }

      setTimeout(() => {
        this.reconnectListener();
      }, 2000);
    }
  }

  async addNotificationListener(channel: string, callback: PostgresNotificationSubscriber) {
    await this.listenForNotification();
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
    this.closed = true;
    if (this.notificationPoolClient) {
      await this.notificationPoolClient.release();
    }
    await this.pool.close();
  }

  async transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>, timeout?: number): Promise<T> {
    const pool = await this.pool.get();
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
}
