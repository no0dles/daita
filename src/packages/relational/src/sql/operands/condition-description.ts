import { NotEqualDescription } from './comparison/not-equal/not-equal-description';
import { GreaterThanDescription } from './comparison/greater-than/greater-than-description';
import { LikeDescription } from './comparison/like/like-description';
import { EqualDescription } from './comparison/equal/equal-description';
import { OrDescription } from '../keyword/or/or-description';
import { AndDescription } from '../keyword/and/and-description';
import { BetweenDescription } from './comparison/between/between-description';
import { ExistsDescription } from '../dml/select/subquery/exists-description';
import { NotBetweenDescription } from './comparison/not-between/not-between-description';
import { NotInDescription } from './comparison/not-in/not-in-description';
import { InDescription } from './comparison/in/in-description';
import { IsNullDescription } from './comparison/is-null/is-null-description';
import { GreaterEqualThanDescription } from './comparison/greater-equal-than/greater-equal-than-description';
import { LowerThanDescription } from './comparison/lower-than/lower-than-description';
import { LowerEqualThanDescription } from './comparison/lower-equal-than/lower-equal-than-description';
import { IsNotNullDescription } from './comparison/is-not-null/is-not-null-description';
import { IsTrueDescription } from './comparison/is-true/is-true-description';
import { IsFalseDescription } from './comparison/is-false/is-false-description';

export type ConditionDescription =
  | EqualDescription<any>
  | ExistsDescription
  | BetweenDescription<any>
  | InDescription<any>
  | NotInDescription<any>
  | NotBetweenDescription<any>
  | NotEqualDescription<any>
  | LikeDescription<any>
  | IsNullDescription<any>
  | IsTrueDescription
  | IsFalseDescription
  | IsNotNullDescription<any>
  | GreaterThanDescription<any>
  | GreaterEqualThanDescription<any>
  | LowerThanDescription<any>
  | LowerEqualThanDescription<any>
  | AndDescription
  | OrDescription;
