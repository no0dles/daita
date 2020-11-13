import { ContextTestContext } from './context-test-context';
import { OrmRelationalSchema } from '../../../packages/orm/schema/orm-relational-schema';
import { RuleContext } from '../../../packages/relational/permission/description/rule-context';

export interface ContextTestFactory {
  getContext(schema: OrmRelationalSchema, auth?: RuleContext): Promise<ContextTestContext>;
}
