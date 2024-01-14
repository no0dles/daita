import { BaseRelationalTransactionAdapter, RelationalTransactionAdapter } from '@daita/relational';
import { Sql } from '@daita/relational';
import { MariadbSql } from '../sql/mariadb-sql';
import { mariadbFormatter } from '../formatter/mariadb-formatter';
import { MariadbFormatContext } from '../formatter/mariadb-format-context';

export interface Execution {
  sql: string;
  values: any[];
}

export class MariadbRelationalDataAdapter
  extends BaseRelationalTransactionAdapter
  implements RelationalTransactionAdapter<MariadbSql>
{
  public readonly executions: Execution[] = [];

  constructor() {
    super();
  }

  toString() {
    return 'mariadb';
  }

  exec(sql: any): void {
    const ctx = new MariadbFormatContext();
    const query = mariadbFormatter.format(sql, ctx);
    this.executions.push({ sql: query, values: ctx.getValues() });
  }

  execRaw(sql: string, values: any[]): void {
    this.executions.push({ sql, values });
  }

  supportsQuery<S>(sql: S): this is RelationalTransactionAdapter<Sql<any> | S> {
    return mariadbFormatter.canHandle(sql);
  }
}
