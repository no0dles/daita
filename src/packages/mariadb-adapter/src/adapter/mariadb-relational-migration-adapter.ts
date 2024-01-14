import { MariadbSql } from '../sql/mariadb-sql';
import { RelationalOrmAdapter, SchemaTableFieldTypeDescription } from '@daita/orm';
import {
  BaseRelationalAdapter,
  RelationalAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
  RelationDoesNotExistsError,
} from '@daita/relational';
import { parseJson } from '@daita/common';
import { Execution, MariadbRelationalDataAdapter } from './mariadb-relational-data-adapter';
import { mariadbFormatter } from '../formatter';
import { Connection, createPool, Pool } from 'mariadb';
import { MariadbFormatContext } from '../formatter/mariadb-format-context';

export interface MariadbRelationalMigrationAdapterOptions {
  connectionString: string;
}

export class MariadbRelationalMigrationAdapter
  extends BaseRelationalAdapter
  implements RelationalOrmAdapter, RelationalAdapter<MariadbSql>
{
  private readonly pool: Pool;

  constructor(private options: MariadbRelationalMigrationAdapterOptions) {
    super();
    this.pool = createPool(this.options.connectionString);
  }

  getDatabaseType(type: SchemaTableFieldTypeDescription, size?: string): string {
    switch (type) {
      case 'string':
        if (size) {
          return `VARCHAR(${size})`;
        }
        return 'TEXT';
      case 'number':
        if (size) {
          return `DECIMAL(${size})`;
        } else {
          return 'DECIMAL(26,10)';
        }
      case 'date':
        if (size) {
          return `DATETIME(${size})`;
        } else {
          return 'DATETIME(3)';
        }
      case 'boolean':
        return 'BOOLEAN';
      case 'json':
        return 'JSON';
      case 'number[]':
        return `JSON`;
      case 'string[]':
        return `JSON`;
      case 'boolean[]':
        return `JSON`;
      case 'uuid':
        return 'VARCHAR(36)';
    }

    throw new Error(`unknown data type ${type}`);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const connection = await this.pool.getConnection();
    try {
      return await this.run(connection, { sql, values });
    } finally {
      await connection.release();
    }
  }

  exec(sql: MariadbSql): Promise<RelationalRawResult> {
    const ctx = new MariadbFormatContext();
    const query = mariadbFormatter.format(sql, ctx);
    return this.execRaw(query, ctx.getValues());
  }

  supportsQuery<S>(sql: S): this is RelationalAdapter<MariadbSql | S> {
    return mariadbFormatter.canHandle(sql);
  }

  async transaction(action: (adapter: RelationalTransactionAdapter<MariadbSql>) => void): Promise<void> {
    const adapter = new MariadbRelationalDataAdapter();
    action(adapter);

    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const execution of adapter.executions) {
        await this.run(connection, execution);
      }
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      await connection.release();
    }
  }

  private async run(connection: Connection, execution: Execution): Promise<RelationalRawResult> {
    try {
      const result = await connection.query(
        {
          sql: execution.sql,
          typeCast: (column, next) => {
            if (column.type == 'TINY' && column.columnLength === 1) {
              const val = column.int();
              return val === null ? null : val === 1;
            } else if (column.columnType === 252) {
              const val = column.string();
              if (!val) {
                return val;
              }
              return parseJson(val);
            }
            return next();
          },
        },
        execution.values,
      );
      return {
        rows: result instanceof Array ? [...result] : [],
        rowCount: result instanceof Array ? result.length : result.affectedRows,
      };
    } catch (e: any) {
      if (e.errno === 1146) {
        const regex1 = /Table '(?<schema>[^.]+)\.(?<relation>[^']*?)' doesn't exist/g;
        const match1 = regex1.exec(e.message);
        const groups1 = match1?.groups || {};
        if (groups1.schema && groups1.relation) {
          throw new RelationDoesNotExistsError(e, execution.sql, execution.values, groups1.schema, groups1.relation);
        } else {
          const regex2 = /Table '(?<relation>[^']*?)' doesn't exist/g;
          const match2 = regex2.exec(e.message);
          const groups2 = match2?.groups || {};
          if (groups2.relation) {
            throw new RelationDoesNotExistsError(e, execution.sql, execution.values, undefined, groups2.relation);
          }
        }
      }
      throw e;
    }
  }
}
