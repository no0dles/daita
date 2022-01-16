import { RelationalDataAdapter } from '@daita/relational';
import { RelationalRawResult } from '@daita/relational';
import { Sql } from '@daita/relational';
import { Pool, PoolConnection } from 'mariadb';
import { MariadbSql } from '../sql/mariadb-sql';
import { mariadbFormatter } from '../formatter/mariadb-formatter';
import { MariadbFormatContext } from '../formatter/mariadb-format-context';
import { Resolvable } from '@daita/common';
import { RelationDoesNotExistsError } from '@daita/relational';
import { parseJson } from '@daita/common';

export class MariadbRelationalDataAdapter implements RelationalDataAdapter<MariadbSql> {
  constructor(protected pool: PoolConnection) {}

  toString() {
    return 'mariadb';
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  exec(sql: Sql<any>): Promise<RelationalRawResult> {
    const ctx = new MariadbFormatContext();
    const query = mariadbFormatter.format(sql, ctx);
    return this.execRaw(query, ctx.getValues());
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    try {
      const result = await this.pool.query(
        {
          sql,
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
        values,
      );
      return {
        rows: result instanceof Array ? [...result] : [],
        rowCount: result instanceof Array ? result.length : result.affectedRows,
      };
    } catch (e) {
      if (e.errno === 1146) {
        const regex1 = /Table '(?<schema>[^.]+)\.(?<relation>[^']*?)' doesn't exist/g;
        const match1 = regex1.exec(e.message);
        const groups1 = match1?.groups || {};
        if (groups1.schema && groups1.relation) {
          throw new RelationDoesNotExistsError(e, sql, values, groups1.schema, groups1.relation);
        } else {
          const regex2 = /Table '(?<relation>[^']*?)' doesn't exist/g;
          const match2 = regex2.exec(e.message);
          const groups2 = match2?.groups || {};
          if (groups2.relation) {
            throw new RelationDoesNotExistsError(e, sql, values, undefined, groups2.relation);
          }
        }
      }
      throw e;
    }
  }

  supportsQuery<S>(sql: S): this is RelationalDataAdapter<Sql<any> | S> {
    return mariadbFormatter.canHandle(sql);
  }
}
