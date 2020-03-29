import {SqlAndExpression} from './sql-and-expression';
import {SqlCompareExpression} from './sql-compare-expression';
import {SqlOrExpression} from './sql-or-expression';
import {SqlInExpression} from './sql-in-expression';

export type SqlExpression = SqlCompareExpression | SqlInExpression | SqlAndExpression | SqlOrExpression;
