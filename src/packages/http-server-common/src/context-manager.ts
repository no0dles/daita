import { Client } from '@daita/relational';

export class ContextManager {
  constructor(private client: Client<any>) {}

  async exec(sql: any) {
    if (!this.client.supportsQuery(sql)) {
      throw new Error('invalid sql');
    } else {
      return this.client.exec(sql);
    }
  }
}
