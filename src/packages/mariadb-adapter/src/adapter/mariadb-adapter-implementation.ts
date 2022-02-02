import { MariadbSql } from '../sql/mariadb-sql';
import { isConnectionStringOptions, MariadbAdapterOptions } from './mariadb-adapter-options';
import { failNever } from '@daita/common';
import { MariadbRelationalMigrationAdapter } from './mariadb-relational-migration-adapter';
import { RelationalOrmAdapterImplementation } from '@daita/orm';
import { RelationalAdapterImplementation } from '@daita/relational';

class MariadbAdapterImplementation
  implements
    RelationalOrmAdapterImplementation<MariadbSql, MariadbAdapterOptions>,
    RelationalAdapterImplementation<MariadbRelationalMigrationAdapter, MariadbSql, MariadbAdapterOptions>
{
  getRelationalAdapter(options: MariadbAdapterOptions): MariadbRelationalMigrationAdapter {
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
