import {
  EqualQuery,
  GreaterThanEqualQuery,
  GreaterThanQuery, InQuery,
  LowerThanEqualQuery,
  LowerThanQuery,
  NotEqualQuery, NotInQuery,
} from '../query';

export type Condition<T> = ValueCondition<T> | AndCondition<T> | OrCondition<T>;

export type ValueCondition<T> = {
  [P in keyof T]?: ConditionFilter<T[P]> | SchemaConstant<T[P]>;
}

export interface SchemaConstant<T> {
  kind: 'now' | 'username';
}

export type ConditionFilter<T> = ConditionRegexFilter | //todo only on string
  ConditionLengthFilter | //Todo only on string
  GreaterThanEqualQuery<T> |
  GreaterThanQuery<T> |
  LowerThanEqualQuery<T> |
  LowerThanQuery<T> |
  EqualQuery<T> |
  NotEqualQuery<T> |
  InQuery<T> |
  NotInQuery<T>;

export interface ConditionLengthFilter {
  $length: number | GreaterThanEqualQuery<number> |
    GreaterThanQuery<number> |
    LowerThanEqualQuery<number> |
    LowerThanQuery<number> |
    EqualQuery<number> |
    NotEqualQuery<number> |
    InQuery<number> |
    NotInQuery<number>;
}

export interface ConditionRegexFilter {
  $regex: RegExp;
}

export interface AndCondition<T> {
  $and: Condition<T>[];
}

export interface OrCondition<T> {
  $or: Condition<T>[];
}

export interface TableRule<T> {
  conditions?: Condition<T>;
  insert?: ValueCondition<T>;
  update?: ValueCondition<T>;
}

export interface TablePermission<T> {
  anonymous?: boolean;
  authorized?: boolean;
  roles?: string[];
  users?: string[];
  select?: SelectPermission<T> | true;
  update?: UpdatePermission<T> | true;
  insert?: InsertPermission<T> | true;
  delete?: DeletePermission<T> | true;
}

export interface SelectPermission<T> {
  where?: Condition<T>;
  skip?: ConditionFilter<number>;
  limit?: ConditionFilter<number>;
  deniedFields?: (keyof T)[];
  allowedFields?: (keyof T)[];
}

export interface InsertPermission<T> {
  deniedFields?: (keyof T)[];
  allowedFields?: (keyof T)[];
}

export interface UpdatePermission<T> {
  where?: Condition<T>;
  deniedFields?: (keyof T)[];
  allowedFields?: (keyof T)[];
}

export interface DeletePermission<T> {
  where?: Condition<T>;
}

export interface RelationalSchemaConstants {
  username: SchemaConstant<string>;
  now: SchemaConstant<Date>;
}
