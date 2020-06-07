import {
  RelationalDataAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
} from '../adapter';

export class RelationalAdapterMock<T = any> implements RelationalTransactionAdapter<T> {
  constructor(private handle: (sql: T) => RelationalRawResult | null) {
  }

  execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    throw new Error('not supported');
  }

  async exec(
    sql: T,
  ): Promise<RelationalRawResult> {
    const result = this.handle(sql);
    if (result) {
      return result;
    }
    throw new Error('unexpected sql');
  }

  transaction<R>(
    action: (adapter: RelationalDataAdapter<T>) => Promise<R>,
  ): Promise<R> {
    return action(new RelationalAdapterMock<T>(this.handle));
  }

  async close() {
  }

  supportsQuery(sql: any): boolean {
    const result = this.handle(sql);
    return result !== null && result !== undefined;
  }
}
