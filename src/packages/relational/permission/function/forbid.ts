import { Sql } from '../../sql';
import {
  AuthDescription,
  Rule,
} from '../index';

export function forbid(auth: AuthDescription[] | AuthDescription, sql: Sql<any>): Rule {
  return {
    type: 'forbid',
    auth,
    sql,
  };
}
