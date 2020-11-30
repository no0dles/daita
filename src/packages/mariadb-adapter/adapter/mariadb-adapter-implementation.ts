import {
  RelationalDataAdapterImplementation,
  RelationalTransactionAdapterImplementation,
} from '../../relational/adapter/relational-adapter-implementation';
import { RelationalMigrationAdapterImplementation } from '../../orm/adapter/relational-migration-adapter-implementation';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import { RelationalMigrationAdapter } from '../../orm/adapter/relational-migration-adapter';
import { MariadbSql } from '../sql/mariadb-sql';
import { sqliteFormatter } from '../../sqlite-adapter/formatter/sqlite-formatter';
import { MariadbRelationalMigrationAdapter } from './mariadb-relational-adapter';
import { createPool } from 'mariadb';
import { isConnectionStringOptions, MariadbAdapterOptions } from './mariadb-adapter-options';
import { Resolvable } from '../../common/utils/resolvable';

class MariadbAdapterImplementation
  implements
    RelationalDataAdapterImplementation<MariadbSql, MariadbAdapterOptions>,
    RelationalTransactionAdapterImplementation<MariadbSql, MariadbAdapterOptions>,
    RelationalMigrationAdapterImplementation<MariadbSql, MariadbAdapterOptions> {
  getRelationalAdapter(
    options: MariadbAdapterOptions,
  ): RelationalTransactionAdapter<MariadbSql> & RelationalMigrationAdapter<MariadbSql> {
    if (isConnectionStringOptions(options)) {
      return new MariadbRelationalMigrationAdapter(
        new Resolvable(createPool(options.connectionString), (pool) => pool?.end()),
      );
    } else {
      return new MariadbRelationalMigrationAdapter(
        new Resolvable(
          createPool({
            user: options.user,
            host: options.host,
            database: options.database,
            password: options.password,
            ssl: options.ssl,
            port: options.port,
          }),
          (pool) => pool?.end(),
        ),
      );
    }
  }

  supportsQuery<S>(sql: S): this is RelationalMigrationAdapterImplementation<MariadbSql | S, MariadbAdapterOptions> {
    return sqliteFormatter.canHandle(sql);
  }
}

export const adapter = new MariadbAdapterImplementation();
