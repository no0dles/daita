import { Client } from '../client/client';
import { StorageOptions } from './storage-options';

export abstract class RelationalStorage {
  private initialized = false;

  constructor(protected options: StorageOptions) {}

  abstract initialize(client: Client<any>): Promise<void>;

  async ensureInitialized<T>(fn: (client: Client<any>) => Promise<T>, client?: Client<any>): Promise<T> {
    if (this.initialized) {
      return fn(client ?? this.options.transactionClient);
    }

    if (client) {
      await this.initialize(client);
      this.initialized = true;
      return fn(client);
    } else {
      return this.options.transactionClient.transaction(async (trx) => {
        await this.initialize(trx);
        this.initialized = true;
        return fn(trx);
      });
    }
  }
}
