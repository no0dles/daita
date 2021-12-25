import { RelationalTransactionAdapter } from '../adapter/relational-transaction-adapter';
import { RelationalRawResult } from '../adapter/relational-raw-result';
import { RelationalDataAdapter } from '../adapter/relational-data-adapter';
import {
  RelationalDataAdapterImplementation,
  RelationalTransactionAdapterImplementation,
} from '../adapter/relational-adapter-implementation';
import { MockAdapterOptions } from './mock-adapter';

export class RelationalAdapterMock<T = any> implements RelationalTransactionAdapter<T> {
  constructor(private handle: (sql: T) => RelationalRawResult | null) {}

  execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    throw new Error('not supported');
  }

  async exec(sql: T): Promise<RelationalRawResult> {
    const result = this.handle(sql);
    if (result) {
      return result;
    }
    throw new Error('unexpected sql: ' + JSON.stringify(sql));
  }

  transaction<R>(action: (adapter: RelationalDataAdapter<T>) => Promise<R>): Promise<R> {
    return action(new RelationalAdapterMock<T>(this.handle));
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
  implements
    RelationalDataAdapterImplementation<any, MockAdapterOptions<any>>,
    RelationalTransactionAdapterImplementation<any, MockAdapterOptions<any>>
{
  getRelationalAdapter(options: MockAdapterOptions<any>): RelationalTransactionAdapter<any> {
    return new RelationalAdapterMock(options);
  }
}
