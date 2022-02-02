import { Http } from '@daita/http-interface';
import { BaseRelationalTransactionAdapter, RelationalTransactionAdapter, Sql } from '@daita/relational';

export class HttpTransactionDataAdapter
  extends BaseRelationalTransactionAdapter
  implements RelationalTransactionAdapter<any>
{
  private statements: Sql<any>[] = [];

  constructor(private transactionId: string, private http: Http) {
    super();
  }

  execRaw(sql: string, values: any[]): void {
    throw new Error('not supported over http');
  }

  supportsQuery(sql: any): boolean {
    throw new Error('not supported over http');
  }

  exec(sql: any): void {
    this.statements.push(sql);
  }

  async close(): Promise<void> {}

  async send() {
    const response = await this.http.json({
      path: `api/relational/trx/${this.transactionId}`,
      authorized: true,
      data: { sqls: this.statements },
    });
    if (response.statusCode !== 200) {
      throw new Error('failed'); // TODO
    }
  }
}
