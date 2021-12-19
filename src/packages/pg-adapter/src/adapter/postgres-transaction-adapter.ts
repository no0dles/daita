import { Pool, PoolClient } from 'pg';
import { PostgresDataAdapter } from './postgres-data-adapter';
import { PostgresSql } from '../sql/postgres-sql';
import { RelationalTransactionAdapter } from '@daita/relational';
import { RelationalDataAdapter } from '@daita/relational';
import { ConnectionError } from '@daita/relational';
import { Resolvable } from '@daita/common';
import { createLogger } from '@daita/common';
import { handleTimeout } from '@daita/common';

export interface PostgresNotificationSubscriber {
  (msg: string | undefined): void;
}

const logger = createLogger({ package: 'pg-adapter' });

export class PostgresTransactionAdapter
  extends PostgresDataAdapter
  implements RelationalTransactionAdapter<PostgresSql>
{
  private closed = false;
  //private pool: Pool | null = null;
  private poolResolvable = new Resolvable<Pool>(
    async () => {
      const connectionString = await this.connectionString.get();
      const pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 10000,
        keepAlive: true,
        max: 20,
        idleTimeoutMillis: 10000,
        application_name: 'daita',
      });
      pool.on('error', (e) => {
        logger.error(e, { client: 'pool' });
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
    super(
      new Resolvable<PoolClient>(
        async () => {
          const pool = await this.poolResolvable.get();
          return pool.connect();
        },
        (client) => client?.release(),
      ),
    );
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

      const pool = await this.poolResolvable.get();
      this.notificationPoolClient = await pool.connect();
      this.notificationPoolClient.on('error', (e) => {
        logger.error(e, { client: 'notification' });
      });
      this.notificationPoolClientAdapter = new PostgresDataAdapter(
        new Resolvable<PoolClient>(this.notificationPoolClient),
      );
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
    await this.client.close();
  }

  async transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>, timeout?: number): Promise<T> {
    const pool = await this.poolResolvable.get();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const adapter = new PostgresDataAdapter(new Resolvable(client, () => client.release()));
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
