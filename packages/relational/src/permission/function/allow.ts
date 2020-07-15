import { Sql } from '../../sql';
import {
  AuthDescription,
  Rule,
} from '../index';

export function allow(auth: AuthDescription[] | AuthDescription, sql: Sql<any>): Rule {
  return {
    type: 'allow',
    auth,
    sql,
  };
}
