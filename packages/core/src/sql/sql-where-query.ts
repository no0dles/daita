import {SqlExpression} from './expression';

export interface SqlWhereQuery {
  where?: SqlExpression | null;
}