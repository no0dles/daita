export class RelationalStorage {
  private initialized = false;

  constructor(private initialize: () => Promise<void>) {}

  async ensureInitialized<T>(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
      this.initialized = true;
    }
  }
}
