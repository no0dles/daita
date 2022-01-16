import { RelationalRawResult } from '../adapter/relational-raw-result';
import { RelationalAdapter } from '../adapter/relational-adapter';
import { RelationalAdapterImplementation } from '../adapter/relational-adapter-implementation';
import { MockAdapterOptions } from './mock-adapter';
import { BaseRelationalAdapter } from '../adapter/base-relational-adapter';

export class RelationalAdapterMock<T = any> extends BaseRelationalAdapter implements RelationalAdapter<T> {
  constructor(private handle: (sql: T) => RelationalRawResult | null) {
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

  transaction<R>(action: (adapter: RelationalAdapter<T>) => Promise<R>): Promise<R> {
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
  implements RelationalAdapterImplementation<any, any, MockAdapterOptions<any>>
{
  getRelationalAdapter(options: MockAdapterOptions<any>): RelationalAdapter<any> {
    return new RelationalAdapterMock(options);
  }
}
