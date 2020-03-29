import {SqlRawValue} from '../sql-raw-value';

export type SqlInsertValue  = {
  [key: string]: SqlRawValue;
};