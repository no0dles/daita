import {SqlCountFunction} from './sql-count-function';
import {SqlMinFunction} from './sql-min-function';
import {SqlConcatFunction} from './sql-concat-function';
import {SqlAvgFunction} from './sql-avg-function';
import {SqlSumFunction} from './sql-sum-function';
import {SqlMaxFunction} from './sql-max-function';

export type SqlFunction =
  SqlCountFunction
  | SqlAvgFunction
  | SqlSumFunction
  | SqlMinFunction
  | SqlMaxFunction
  | SqlConcatFunction;