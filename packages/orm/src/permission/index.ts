import { Constructable, PickByValue } from '@daita/common';
import { isSelectSql, ValueType } from '@daita/relational';
import { ContextAuthorization } from '../context';

export enum RuleResult {
  Accept,
  Reject,
  Next
}

export type RuleDescription = (ctx: ContextAuthorization) => Rule;

export interface Rule {
  check(sql: any, ctx: ContextAuthorization): RuleResult;
}

function allow(...rules: RuleCondition[]): RuleDescription {
  return (ctx) => ({
    check(sql: any): RuleResult {
      for (const rule of rules) {
        const result = rule.check(sql, ctx);
        if (result === ConditionResult.NotMatched || result === ConditionResult.PartialMatch) {
          return RuleResult.Next;
        }
      }
      return RuleResult.Accept;
    },
  });
}

function reject(...rules: RuleCondition[]): RuleDescription {
  return ctx => ({
    check(sql: any): RuleResult {
      if (rules.length === 0) {
        return RuleResult.Reject;
      }

      for (const rule of rules) {
        const result = rule.check(sql, ctx);
        if (result === ConditionResult.Match || result === ConditionResult.PartialMatch) {
          return RuleResult.Reject;
        }
      }
      return RuleResult.Accept;
    },
  });
}

export enum ConditionResult {
  Match,
  PartialMatch,
  NotMatched,
}

export interface RuleCondition {
  check(sql: any, ctx: ContextAuthorization): ConditionResult;
}

function selectFields<T, K extends keyof PickByValue<T, ValueType>>(type: Constructable<T>, ...fields: K[]): RuleCondition {
  return {
    check(sql: any, ctx: ContextAuthorization): ConditionResult {
      if (!isSelectSql(sql)) {
        return ConditionResult.NotMatched;
      }

      if (fields.length === 0) {
        return ConditionResult.Match;
      }

      return ConditionResult.PartialMatch; //TODO implement
    },
  };
}

export type NumberValidation = { lowerThan?: number, greaterThan?: number } | { in: number[] } | { notIn: number[] };
export type StringValidation = { regex?: RegExp } | { in: string[] } | { notIn: string[] };
export type Validation<T> =
  T extends number ? NumberValidation :
    T extends string ? StringValidation : never;

function limit(validation: NumberValidation): RuleCondition {
  return {
    check(sql: any, ctx: ContextAuthorization): ConditionResult {
      if (!isSelectSql(sql)) {
        return ConditionResult.NotMatched;
      }

      return ConditionResult.PartialMatch; //TODO implement
    },
  };
}

function where<T, K extends keyof PickByValue<T, ValueType>>(type: Constructable<T>, field: K, validation: Validation<T[K]> | ((ctx: ContextAuthorization) => Validation<T[K]>)): RuleCondition {
  return {
    check(sql: any, ctx: ContextAuthorization): ConditionResult {
      if (!isSelectSql(sql)) {
        return ConditionResult.NotMatched;
      }

      return ConditionResult.PartialMatch; //TODO implement
    },
  };
}

class User {
  id!: string;
  name!: string;
  password!: string;
}

export const testRules: RuleDescription[] = [
  allow(selectFields(User, 'id', 'name')),
  allow(selectFields(User)),
  allow(where(User, 'id', { in: ['10'] })),
  allow(limit({ lowerThan: 100 })),
  reject(selectFields(User, 'password')),
  reject(),
];

export interface RuleValidator {
  isAuthorized(sql: any): boolean;
  getAuthorizationError(sql: any): Error | null;
}

export interface SqlAuthRequest {
  kind: 'sql';
  sql: any;
}

export interface AuthRequest {
  type: string;
}

export interface ExecuteAuthRequest {
  type: 'execute'
}

export class ContextValidator implements RuleValidator {
  constructor(private ctx: ContextAuthorization,
              private rules: RuleDescription[]) {
  }

  isAuthorized(sql: any): boolean {
    let accepted = false;
    for (const rule of this.rules) {
      const result = rule(this.ctx).check(sql, this.ctx);
      if (result === RuleResult.Reject) {
        return false;
      } else if (result === RuleResult.Accept) {
        accepted = true;
      }
    }

    return accepted;
  }

  getAuthorizationError(sql: any): Error | null {
    return null;
  }
}
