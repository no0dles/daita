import { RelationalAdapter, RelationalTransactionAdapter } from '@daita/relational';

export class ContextManager {
  constructor(private client: RelationalTransactionAdapter<any>) {}

  async exec(sql: any) {
    if (!this.client.supportsQuery(sql)) {
      throw new Error('invalid sql');
    } else {
      return this.client.exec(sql);
    }
  }
}
