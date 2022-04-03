import { RelationalOrmAdapter } from '../adapter';
import {
  AuthorizedAdapter,
  DeleteSql,
  InsertSql,
  RelationalAdapter,
  RelationalAuthorizableAdapter,
  RelationalAuthorizedAdapter,
  RuleContext,
  RulesEvaluator,
  UpdateSql,
} from '@daita/relational';
import { ContextOptions, getMigrationContext } from './context';
import { getMigrationTreeSchema } from '../schema/migration-tree-schema';
import { OrmSql } from '../migration';

export function authorizable<TQuery extends InsertSql<any> & UpdateSql<any> & DeleteSql & OrmSql>(
  adapter: RelationalAdapter<TQuery> & RelationalOrmAdapter,
  options: ContextOptions<TQuery>,
): RelationalAuthorizableAdapter<TQuery> {
  const context = getMigrationContext(adapter, options);
  const rulesEvaluator = () =>
    context.getMigrations().then((migrationTree) => {
      const rules = getMigrationTreeSchema(migrationTree).rules || {};
      return new RulesEvaluator(Object.keys(rules).map((id) => ({ id, rule: rules[id].rule })));
    });

  return {
    authorize(context: RuleContext): RelationalAuthorizedAdapter<TQuery> {
      return new AuthorizedAdapter(adapter, context, rulesEvaluator);
    },
  };
}
