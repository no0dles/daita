import { SqlClient } from '@daita/relational';

export class ContextManager {
  constructor(private client: SqlClient) {}

  async exec(sql: any) {
    if (!this.client.supportsQuery(sql)) {
      throw new Error('invalid sql');
    } else {
      return this.client.exec(sql);
    }
  }
}
