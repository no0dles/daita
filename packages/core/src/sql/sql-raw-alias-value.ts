import {SqlRawValue} from './sql-raw-value';
import {SqlAlias} from './sql-alias';

export interface SqlRawAliasValue extends SqlAlias {
  value: SqlRawValue;
}