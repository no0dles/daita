import { Sql } from '../../sql';
import { RuleContext, RuleValidateResult } from '../index';

export interface Rule {
  validate(sql: Sql<any>, ctx: RuleContext): RuleValidateResult;
}
