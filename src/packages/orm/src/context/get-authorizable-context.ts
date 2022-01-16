import { RelationalOrmAdapter } from '../adapter';
import {
  AuthorizedAdapter,
  RelationalAdapter,
  RelationalAuthorizableAdapter,
  RelationalAuthorizedAdapter,
  RuleContext,
  RulesEvaluator,
} from '@daita/relational';
import { ContextOptions, getMigrationContext } from './context';

export function authorizable<TQuery>(
  adapter: RelationalAdapter<TQuery> & RelationalOrmAdapter,
  options: ContextOptions,
): RelationalAuthorizableAdapter<TQuery> {
  const context = getMigrationContext(adapter, options);
  const rulesEvaluator = () =>
    context.getMigrations().then((migrationTree) => {
      const rules = migrationTree.getSchemaDescription().rules || {};
      return new RulesEvaluator(Object.keys(rules).map((id) => ({ id, rule: rules[id] })));
    });

  return {
    authorize(context: RuleContext): RelationalAuthorizedAdapter<TQuery> {
      return new AuthorizedAdapter(adapter, context, rulesEvaluator);
    },
  };
}
