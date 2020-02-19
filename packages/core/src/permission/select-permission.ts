import {GreaterThanEqualQuery, GreaterThanQuery, LowerThanEqualQuery, LowerThanQuery} from '../query';
import {SelectPermissionWhere} from './select-permission-where';

export interface SelectPermission<T> {
  fields?: (keyof T)[] | keyof T;
  limit?: number | GreaterThanQuery<number> | GreaterThanEqualQuery<number> | LowerThanEqualQuery<number> | LowerThanQuery<number>;
  skip?: number | GreaterThanQuery<number> | GreaterThanEqualQuery<number> | LowerThanEqualQuery<number> | LowerThanQuery<number>;
  where?: SelectPermissionWhere<T>;
}
