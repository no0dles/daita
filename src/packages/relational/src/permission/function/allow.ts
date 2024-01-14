import { AuthDescription } from '../description/auth-description';
import { Sql } from '../../sql/sql';
import { Rule } from '../description/rule';

export function allow(auth: AuthDescription, sql: Sql<any>): Rule {
  return {
    type: 'allow',
    auth,
    sql,
  };
}
