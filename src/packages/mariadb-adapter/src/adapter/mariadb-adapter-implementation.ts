import { RelationalDataAdapterImplementation, RelationalTransactionAdapterImplementation } from '@daita/relational';
import { RelationalMigrationAdapterImplementation } from '@daita/orm';
import { RelationalTransactionAdapter } from '@daita/relational';
import { RelationalMigrationAdapter } from '@daita/orm';
import { MariadbSql } from '../sql/mariadb-sql';
import { createPool } from 'mariadb';
import { isConnectionStringOptions, MariadbAdapterOptions } from './mariadb-adapter-options';
import { failNever, Resolvable } from '@daita/common';
import { MariadbRelationalMigrationAdapter } from './mariadb-relational-migration-adapter';

class MariadbAdapterImplementation
  implements
    RelationalDataAdapterImplementation<MariadbSql, MariadbAdapterOptions>,
    RelationalTransactionAdapterImplementation<MariadbSql, MariadbAdapterOptions>,
    RelationalMigrationAdapterImplementation<MariadbSql, MariadbAdapterOptions>
{
  getRelationalAdapter(
    options: MariadbAdapterOptions,
  ): RelationalTransactionAdapter<MariadbSql> & RelationalMigrationAdapter<MariadbSql> {
    if (isConnectionStringOptions(options)) {
      return new MariadbRelationalMigrationAdapter({
        connectionString: options.connectionString,
      });
    } else {
      failNever(options, 'unknown options');
    }
    // else {
    //   return new MariadbRelationalMigrationAdapter(
    //     new Resolvable(
    //       createPool({
    //         user: options.user,
    //         host: options.host,
    //         database: options.database,
    //         password: options.password,
    //         ssl: options.ssl,
    //         port: options.port,
    //       }),
    //       (pool) => pool?.end(),
    //     ),
    //   );
    // }
  }
}

export const adapter = new MariadbAdapterImplementation();
