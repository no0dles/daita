import { AuthDescription } from './auth-description';
import { Sql } from '../../sql/sql';

export interface Rule {
  type: 'allow' | 'forbid';
  auth: AuthDescription[] | AuthDescription;
  sql: Sql<any>;
}
