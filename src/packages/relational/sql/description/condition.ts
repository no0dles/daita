import { NotEqualDescription } from './not-equal';
import { GreaterThanDescription } from './greater-than';
import { LikeDescription } from './like';
import { EqualDescription } from './equal';
import { OrDescription } from './or';
import { AndDescription } from './and';
import { BetweenDescription } from './between';
import { ExistsDescription } from './exists';
import { NotBetweenDescription } from './not-between';
import { NotInDescription } from './not-in';
import { InDescription } from './in';
import { IsNullDescription } from './is-null';
import { GreaterEqualThanDescription } from './greater-equal-than';
import { LowerThanDescription } from './lower-than';
import { LowerEqualThanDescription } from './lower-equal-than';

export type Condition =
  | EqualDescription<any>
  | ExistsDescription
  | BetweenDescription<any>
  | InDescription<any>
  | NotInDescription<any>
  | NotBetweenDescription<any>
  | NotEqualDescription<any>
  | LikeDescription<any>
  | IsNullDescription<any>
  | GreaterThanDescription<any>
  | GreaterEqualThanDescription<any>
  | LowerThanDescription<any>
  | LowerEqualThanDescription<any>
  | AndDescription
  | OrDescription;
