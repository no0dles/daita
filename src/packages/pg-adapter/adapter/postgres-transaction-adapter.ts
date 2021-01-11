import { Pool, PoolClient } from 'pg';
import { PostgresDataAdapter } from './postgres-data-adapter';
import { PostgresSql } from '../sql/postgres-sql';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import { ConnectionError } from '../../relational/error/connection-error';
import { Resolvable } from '../../common/utils/resolvable';
import { createLogger } from '../../common/utils/logger';

export interface PostgresNotificationSubscriber {
  (msg: string | undefined): void;
}

const logger = createLogger({ package: 'pg-adapter' });

export class PostgresTransactionAdapter
  extends PostgresDataAdapter<Pool>
  implements RelationalTransactionAdapter<PostgresSql> {
  private closed = false;
  private pool: Pool | null = null;

  private notificationPoolClient: PoolClient | undefined = undefined;
  private notificationPoolClientAdapter: RelationalDataAdapter<PostgresSql> | undefined = undefined;
  private notificationSubscribers: { [key: string]: PostgresNotificationSubscriber[] } = {};

  constructor(protected connectionString: Resolvable<string>) {
    super(
      new Resolvable(
        async () => {
          const connectionString = await this.connectionString.get();
          this.pool = new Pool({
            connectionString,
            connectionTimeoutMillis: 10000,
            keepAlive: true,
            max: 20,
            idleTimeoutMillis: 10000,
            application_name: 'daita',
          });
          this.pool.on('error', (e) => {
            logger.error(e, { client: 'pool' });
          });
          return this.pool;
        },
        () => {
          this.pool?.end();
          return this.connectionString.close();
        },
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

      const pool = await this.client.get();
      this.notificationPoolClient = await pool.connect();
      this.notificationPoolClient.on('error', (e) => {
        logger.error(e, { client: 'notification' });
      });
      this.notificationPoolClientAdapter = new PostgresDataAdapter(new Resolvable(this.notificationPoolClient));
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

  async transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
    const pool = await this.client.get();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const adapter = new PostgresDataAdapter(new Resolvable(client, () => client.release()));
      const result = await action(adapter);
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
