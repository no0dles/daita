import { EqualQuery } from './equal-query';
import { GreaterThanEqualQuery } from './greater-than-equal-query';
import { GreaterThanQuery } from './greater-than-query';
import { InQuery } from './in-query';
import { LikeQuery } from './like-query';
import { LowerThanEqualQuery } from './lower-than-equal-query';
import { LowerThanQuery } from './lower-than-query';
import { NotEqualQuery } from './not-equal-query';
import { NotInQuery } from './not-in-query';
import { QueryFilter } from './query-filter';
import { QueryFilterObject } from './query-filter-object';

export type QuerySelector<T> =
  | LikeQuery<T>
  | EqualQuery<T>
  | NotEqualQuery<T>
  | GreaterThanQuery<T>
  | GreaterThanEqualQuery<T>
  | InQuery<T>
  | NotInQuery<T>
  | LowerThanQuery<T>
  | LowerThanEqualQuery<T>
  | T
  | QueryFilterObject<T>
  | QueryFilter<T>;
