import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { Sql } from '../../relational/sql/sql';
import { Pool, PoolConnection } from 'mariadb';
import { MariadbSql } from '../sql/mariadb-sql';
import { mariadbFormatter } from '../formatter/mariadb-formatter';
import { MariadbFormatContext } from '../formatter/mariadb-format-context';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import { RelationalMigrationAdapter } from '../../orm/adapter/relational-migration-adapter';
import { Client } from '../../relational/client/client';
import { MigrationPlan } from '../../orm/context/relational-migration-context';
import { MigrationDescription } from '../../orm/migration/migration-description';
import { Defer } from '../../common/utils/defer';
import { RelationalClient } from '../../relational/client/relational-client';
import { Resolvable } from '../../common/utils/resolvable';
import { MigrationStorage } from '../../orm/migration/schema/migration-schema';

export class MariadbRelationalDataAdapter implements RelationalDataAdapter<MariadbSql> {
  constructor(protected pool: Resolvable<Pool> | Resolvable<PoolConnection>) {}

  toString() {
    return 'mariadb';
  }

  async close(): Promise<void> {
    await this.pool.close();
  }

  exec(sql: Sql<any>): Promise<RelationalRawResult> {
    const ctx = new MariadbFormatContext();
    const query = mariadbFormatter.format(sql, ctx);
    return this.execRaw(query, ctx.getValues());
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const pool = await this.pool.get();
    const result = await pool.query(sql, values);
    return {
      rows: result,
      rowCount: result.length,
    };
  }

  supportsQuery<S>(sql: S): this is RelationalDataAdapter<Sql<any> | S> {
    return mariadbFormatter.canHandle(sql);
  }
}

export class MariadbRelationalTransactionAdapter
  extends MariadbRelationalDataAdapter
  implements RelationalTransactionAdapter<MariadbSql> {
  constructor(protected pool: Resolvable<Pool>) {
    super(pool);
  }
  async transaction<T>(action: (adapter: RelationalDataAdapter<MariadbSql>) => Promise<T>): Promise<T> {
    const pool = await this.pool.get();
    const connection = await pool.getConnection();
    try {
      const adapter = new MariadbRelationalDataAdapter(new Resolvable(connection));
      const result = await action(adapter);
      await connection.commit();
      return result;
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  }
}

export class MariadbRelationalMigrationAdapter
  extends MariadbRelationalTransactionAdapter
  implements RelationalMigrationAdapter<MariadbSql> {
  private storage = new MigrationStorage();

  async applyMigration(client: Client<MariadbSql>, schema: string, migrationPlan: MigrationPlan): Promise<void> {
    await this.storage.initalize(client);
    await this.storage.add(client, schema, migrationPlan.migration);
    for (const step of migrationPlan.migration.steps) {
    }
  }

  async getAppliedMigrations(client: Client<MariadbSql>, schema: string): Promise<MigrationDescription[]> {
    await this.storage.initalize(client);
    return this.storage.get(client, schema);
  }

  getClient(handle: Promise<void>): Promise<Client<MariadbSql>> {
    const defer = new Defer<Client<MariadbSql>>();
    this.transaction(async (trx) => {
      const client = new RelationalClient(trx);
      await this.storage.initalize(client);
      defer.resolve(client);
      await handle;
    }).catch((err) => defer.reject(err));
    return defer.promise;
  }
}
