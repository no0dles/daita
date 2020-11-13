import { TransactionContextTestContext } from './transaction-context-test-context';
import { OrmRelationalSchema } from '../../../packages/orm/schema/orm-relational-schema';
import { RuleContext } from '../../../packages/relational/permission/description/rule-context';

export interface TransactionContextTestFactory {
  getContext(schema: OrmRelationalSchema, auth?: RuleContext): Promise<TransactionContextTestContext>;
}
