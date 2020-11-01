import { AuthDescription } from '../description/auth-description';
import { Sql } from '../../sql/sql';
import { Rule } from '../description/rule';

export function forbid(auth: AuthDescription[] | AuthDescription, sql: Sql<any>): Rule {
  return {
    type: 'forbid',
    auth,
    sql,
  };
}
