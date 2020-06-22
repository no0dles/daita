import { Sql } from '../../sql';
import {
  AuthDescription,
  matchesAuthsDescription,
  matchesObject,
  Rule,
  RuleContext,
  RuleValidateResult,
} from '../index';

export function allow(auth: AuthDescription[] | AuthDescription, sql: Sql<any>): Rule {
  return {
    validate(ctxSql: Sql<any>, ctx: RuleContext): RuleValidateResult {
      if (!matchesAuthsDescription(auth, ctx)) {
        return { type: 'next' };
      }

      const error = matchesObject(sql, ctxSql, []);
      if (!error) {
        return { type: 'allow' };
      }

      return { type: 'next', error };
    },
  };
}
