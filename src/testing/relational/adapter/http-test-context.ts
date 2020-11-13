import { ContextTestContext } from './context-test-context';
import { TransactionContextTestContext } from './transaction-context-test-context';
import { getContext, TransactionContext } from '../../../packages/orm';
import { Server } from 'http';
import { adapter as httpAdapter } from '../../../packages/http-adapter';
import { Defer } from '../../../packages/common';
import { MigrationTree } from '../../../packages/orm/migration/migration-tree';

export class HttpTestContext implements ContextTestContext, TransactionContextTestContext {
  context: TransactionContext<any>;
  migrationTree: MigrationTree;

  constructor(
    private baseContext: ContextTestContext | TransactionContextTestContext,
    private port: number,
    private server: Server,
  ) {
    this.migrationTree = this.baseContext.migrationTree;
    this.context = getContext(httpAdapter, {
      baseUrl: `http://localhost:${this.port}`,
      authProvider: null,
      migrationTree: baseContext.migrationTree,
    });
  }

  async close(): Promise<void> {
    await this.baseContext.close();
    const defer = new Defer<void>();
    this.server.close((err) => {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve();
      }
    });
    await defer.promise;
    await this.context.close();
  }
}
