import { Pool, PoolClient, types } from 'pg';
import { PostgresDataAdapter } from './postgres-data-adapter';
import { postgresFormatter } from '../formatters/postgres-formatter';
import { PostgresSql } from '../sql/postgres-sql';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import { ConnectionError } from '../../relational/error/connection-error';

export interface PostgresNotificationSubscriber {
  (msg: string | undefined): void;
}

export class PostgresAdapter implements RelationalTransactionAdapter<PostgresSql> {
  private readonly pool: Promise<Pool>;
  private closed = false;
  private readonly connectionString: string | undefined;

  private notificationPoolClient: PoolClient | undefined = undefined;
  private notificationPoolClientAdapter: RelationalDataAdapter<PostgresSql> | undefined = undefined;
  private notificationSubscribers: { [key: string]: PostgresNotificationSubscriber[] } = {};

  constructor(private poolOrUrl: string | Promise<Pool> | Pool, private options: { listenForNotifications: boolean }) {
    types.setTypeParser(1700, (val) => parseFloat(val));
    types.setTypeParser(701, (val) => parseFloat(val));
    types.setTypeParser(20, (val) => parseInt(val));

    if (typeof poolOrUrl === 'string') {
      this.connectionString = poolOrUrl;
      this.pool = Promise.resolve(
        new Pool({
          connectionString: poolOrUrl,
          connectionTimeoutMillis: 10000,
          keepAlive: true,
          max: 20,
          idleTimeoutMillis: 10000,
          log: (messages) => console.log(messages),
        }),
      );
    } else if (poolOrUrl instanceof Promise) {
      this.pool = poolOrUrl;
    } else {
      this.pool = Promise.resolve(poolOrUrl);
    }

    this.pool.then((pool) => {
      pool.on('error', (err) => {
        console.log('err', err);
      });
    });

    if (this.options.listenForNotifications) {
      this.listenForNotification();
    }
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

      const pool = await this.pool;
      this.notificationPoolClient = await pool.connect();
      this.notificationPoolClientAdapter = new PostgresDataAdapter(this.notificationPoolClient);
      this.notificationPoolClient.on('notification', (msg) => {
        const subscribers = this.notificationSubscribers[msg.channel] ?? [];
        for (const subscriber of subscribers) {
          subscriber(msg.payload);
        }
      });
      this.notificationPoolClient.on('error', () => {
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
    const pool = await this.pool;
    await pool.end();
  }

  private async run<T>(action: (client: PoolClient) => Promise<T>): Promise<T> {
    let client: PoolClient | null = null;
    try {
      const pool = await this.pool;
      client = await pool.connect();
      const result = await action(client);
      if (client) {
        client.release();
        client = null;
      }
      return result;
    } catch (e) {
      if (client) {
        client.release(e);
        client = null;
      }
      if (e.errno === -111) {
        throw new ConnectionError(e);
      }
      throw e;
    }
  }

  async transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
    return await this.run(async (client) => {
      try {
        await client.query('BEGIN');
        const adapter = new PostgresDataAdapter(client);
        const result = await action(adapter);
        await client.query('COMMIT');
        return result;
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      }
    });
  }

  execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    return this.run(async (client) => {
      const adapter = new PostgresDataAdapter(client);
      return adapter.execRaw(sql, values);
    });
  }

  exec(sql: any): Promise<RelationalRawResult> {
    return this.run(async (client) => {
      const adapter = new PostgresDataAdapter(client);
      return adapter.exec(sql as any);
    });
  }

  supportsQuery(sql: any): boolean {
    return postgresFormatter.canHandle(sql);
  }
}
