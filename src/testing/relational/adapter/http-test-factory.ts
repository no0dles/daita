import { getFreeTestPort } from '../../postgres-test';
import { createHttpServerApp } from '../../../packages/http-server';
import { Defer } from '../../../packages/common';
import { ContextTestContext } from './context-test-context';
import { TransactionContextTestContext } from './transaction-context-test-context';
import { HttpTestContext } from './http-test-context';
import { ContextTestFactory } from './context-test-factory';
import { TransactionContextTestFactory } from './transaction-context-test-factory';
import { OrmRelationalSchema } from '../../../packages/orm/schema/orm-relational-schema';
import { RuleContext } from '../../../packages/relational/permission/description/rule-context';

export class HttpTestFactory implements ContextTestFactory, TransactionContextTestFactory {
  constructor(private baseTestFactory: ContextTestFactory & TransactionContextTestFactory) {}

  async getContext(schema: OrmRelationalSchema, auth?: RuleContext): Promise<TransactionContextTestContext> {
    const port = await getFreeTestPort();
    const baseContext = await this.baseTestFactory.getContext(schema, auth);
    const app = createHttpServerApp(baseContext.context, {
      authorization: false,
      cors: true,
      transactionTimeout: 2000,
    });
    const defer = new Defer<void>();
    const server = app.listen(port, () => {
      defer.resolve();
    });
    await defer.promise;
    return new HttpTestContext(baseContext, port, server);
  }

  toString() {
    return 'http-' + this.baseTestFactory.toString();
  }
}
