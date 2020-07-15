import { Sql } from '../../sql';
import { AuthDescription } from '../index';

export interface Rule {
  type: 'allow' | 'forbid';
  auth: AuthDescription[] | AuthDescription;
  sql: Sql<any>;
}
