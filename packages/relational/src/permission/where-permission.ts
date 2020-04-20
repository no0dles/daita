import {
  EqualQuery,
  GreaterThanEqualQuery,
  GreaterThanQuery,
  LowerThanEqualQuery,
  LowerThanQuery,
  NotEqualQuery,
} from '../query';

export type WherePermission<T> =
  | T
  | GreaterThanEqualQuery<T>
  | GreaterThanQuery<T>
  | LowerThanQuery<T>
  | LowerThanEqualQuery<T>
  | NotEqualQuery<T>
  | EqualQuery<T>;
