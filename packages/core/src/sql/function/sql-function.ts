import { isSqlCountFunction, SqlCountFunction } from './sql-count-function';
import { isSqlMinFunction, SqlMinFunction } from './sql-min-function';
import { isSqlConcatFunction, SqlConcatFunction } from './sql-concat-function';
import { isSqlAvgFunction, SqlAvgFunction } from './sql-avg-function';
import { isSqlSumFunction, SqlSumFunction } from './sql-sum-function';
import { isSqlMaxFunction, SqlMaxFunction } from './sql-max-function';

export type SqlFunction =
  | SqlCountFunction
  | SqlAvgFunction
  | SqlSumFunction
  | SqlMinFunction
  | SqlMaxFunction
  | SqlConcatFunction;

export const isSqlFunction = (val: any): val is SqlFunction =>
  isSqlCountFunction(val) ||
  isSqlAvgFunction(val) ||
  isSqlSumFunction(val) ||
  isSqlMinFunction(val) ||
  isSqlMaxFunction(val) ||
  isSqlConcatFunction(val);
