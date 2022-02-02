import { RelationalRawResult } from '../adapter/relational-raw-result';
import { RelationalAdapter, RelationalTransactionAdapter } from '../adapter/relational-adapter';
import { RelationalAdapterImplementation } from '../adapter/relational-adapter-implementation';
import { MockAdapterOptions } from './mock-adapter';
import { BaseRelationalAdapter, BaseRelationalTransactionAdapter } from '../adapter/base-relational-adapter';
import { DeleteSql, InsertSql, UpdateSql } from '../sql';

export class RelationalTransactionAdapterMock<T extends InsertSql<any> & UpdateSql<any> & DeleteSql>
  extends BaseRelationalTransactionAdapter
  implements RelationalTransactionAdapter<T>
{
  constructor(private handle: (sql: any) => RelationalRawResult | null) {
    super();
  }

  exec(sql: T): void {
    this.handle(sql);
  }

  execRaw(sql: string, values: any[]): void {
    throw new Error('not supported');
  }

  supportsQuery<S>(sql: S): this is RelationalTransactionAdapter<T | S> {
    const result = this.handle(sql);
    return result !== null && result !== undefined;
  }
}

export class RelationalAdapterMock<T extends InsertSql<any> & UpdateSql<any> & DeleteSql>
  extends BaseRelationalAdapter
  implements RelationalAdapter<T>
{
  constructor(private handle: (sql: any) => RelationalRawResult | null) {
    super();
  }

  execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    throw new Error('not supported');
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    const result = this.handle(sql);
    if (result) {
      return result;
    }
    throw new Error('unexpected sql: ' + JSON.stringify(sql));
  }

  async transaction(action: (adapter: RelationalTransactionAdapter<T>) => void): Promise<void> {
    return action(new RelationalTransactionAdapterMock<T>(this.handle));
  }

  close() {
    return Promise.resolve();
  }

  supportsQuery(sql: any): boolean {
    const result = this.handle(sql);
    return result !== null && result !== undefined;
  }
}

export class RelationalAdapterMockImplementation
  implements RelationalAdapterImplementation<any, any, MockAdapterOptions<any>>
{
  getRelationalAdapter(options: MockAdapterOptions<any>): RelationalAdapter<any> {
    return new RelationalAdapterMock(options);
  }
}
