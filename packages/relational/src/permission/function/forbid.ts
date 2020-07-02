import { Sql } from '../../sql';
import { AuthDescription, matchesAuthsDescription, matchesObject, Rule, RuleValidateResult } from '../index';

export function forbid(auth: AuthDescription[] | AuthDescription, sql: Sql<any>): Rule {
  return {
    validate(ctxSql, ctx): RuleValidateResult {
      if (!matchesAuthsDescription(auth, ctx)) {
        return { type: 'next' };
      }

      const error = matchesObject(ctx, sql, ctxSql, []);
      if (error) {
        return { type: 'forbid', error };
      }
      return { type: 'next' };
    },
  };
}
