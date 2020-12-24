import { isAnything } from './function/anything';
import { Rule } from './description/rule';
import { isRequestContext } from './function/request-context';
import { isAllowRegex } from './function/allow-regex';
import { RuleContext } from './description/rule-context';
import { getRuleId } from './rule-id';

export interface RuleResult {
  id: string;
  type: 'allow' | 'forbid';
  score: number;
  matchCount: number;
  conditionsCount: number;
  errors: RuleErrorResult[];
}

export interface RuleErrorResult {
  path?: string[];
  message: string;
}

export interface RuleEvaluatorMatcher {
  (sql: any, ruleContext: RuleContext): RuleErrorResult | null;
}

export function getValueFromPath(obj: any, path: string[]) {
  let current = obj;
  for (const pathPart of path) {
    if (current === undefined || current === null) {
      return current;
    }

    current = current[pathPart];
  }

  return current;
}

export function getRuleMatchers(authSql: any, path: string[]): RuleEvaluatorMatcher[] {
  const matchers: RuleEvaluatorMatcher[] = [];

  if (isAnything(authSql)) {
    matchers.push((sql) => {
      const value = getValueFromPath(sql, path);
      if (value !== undefined && value !== null) {
        return null;
      }

      return {
        path,
        message: `missing value`,
      };
    });
  } else if (isRequestContext(authSql)) {
    matchers.push((sql, ruleContext) => {
      const contextValue = authSql.getContextValue(ruleContext);
      const value = getValueFromPath(sql, path);
      if (value === contextValue) {
        return null;
      }

      return {
        message: `should match to request context value "${contextValue}"`,
        path: path,
      };
    });
  } else if (isAllowRegex(authSql)) {
    matchers.push((sql) => {
      const value = getValueFromPath(sql, path);
      if (typeof value !== 'string') {
        return {
          message: 'should be of type string',
          path,
        };
      }
      if (authSql.allowRegex.regExp.test(value)) {
        return null;
      } else {
        return {
          path,
          message: `should match regexp ${authSql.allowRegex.regExp}`,
        };
      }
    });
  } else if (
    typeof authSql === 'string' ||
    typeof authSql === 'boolean' ||
    typeof authSql === 'number' ||
    authSql instanceof Date
  ) {
    matchers.push((sql) => {
      const value = getValueFromPath(sql, path);
      if (value === authSql) {
        return null;
      }

      return {
        path,
        message: `should match value ${authSql}`,
      };
    });
  } else if (authSql instanceof Array) {
    matchers.push((sql) => {
      const value = getValueFromPath(sql, path);
      if (value instanceof Array) {
        return null;
      }

      return {
        path,
        message: `should be an array`,
      };
    });
    for (let i = 0; i < authSql.length; i++) {
      matchers.push(...getRuleMatchers(authSql[i], [...path, i.toString()]));
    } // TODO support or
  } else if (typeof authSql === 'object') {
    const authSqlKeys = Object.keys(authSql);
    matchers.push((sql) => {
      const value = getValueFromPath(sql, path);
      if (!value) {
        return {
          path,
          message: `should be of type object`,
        };
      }

      const valueKeys = Object.keys(value);
      const missingValueKeys = authSqlKeys.filter((k) => valueKeys.indexOf(k) === -1);
      if (missingValueKeys.length > 0) {
        return {
          path,
          message: `should contain object keys ${missingValueKeys.join(', ')}`,
        };
      }

      const extraValueKeys = valueKeys.filter((k) => authSqlKeys.indexOf(k) === -1);
      if (extraValueKeys.length > 0) {
        return {
          path,
          message: `should not contain object keys ${missingValueKeys.join(', ')}`,
        };
      }

      return null;
    });
    for (const key of authSqlKeys) {
      matchers.push(...getRuleMatchers(authSql[key], [...path, key]));
    }
  } else {
    throw new Error(`unknown rule value ${authSql}`);
  }

  return matchers;
}

export class RulesEvaluator {
  private readonly allowRules: RuleEvaluator[];
  private readonly forbidRules: RuleEvaluator[];

  constructor(rules: { id: string; rule: Rule }[]) {
    //TODO rule description
    this.allowRules = rules.filter((r) => r.rule.type === 'allow').map((r) => new RuleEvaluator(r.id, r.rule));
    this.forbidRules = rules.filter((r) => r.rule.type === 'forbid').map((r) => new RuleEvaluator(r.id, r.rule));
  }

  evaluate(auth: RuleContext, sql: any): RuleResult | null {
    let currentResult: RuleResult | null = null;
    for (const forbidRule of this.forbidRules) {
      const result = forbidRule.evaluate(auth, sql);
      if (!currentResult || currentResult.score < result.score) {
        currentResult = result;
      }
    }
    if (currentResult && currentResult.score === 1) {
      return currentResult;
    }

    currentResult = null;
    for (const allowRule of this.allowRules) {
      const result = allowRule.evaluate(auth, sql);
      if (result.score === 1) {
        return result;
      } else if (!currentResult || result.score > currentResult.score) {
        currentResult = result;
      }
    }

    return currentResult;
  }
}

export class RuleEvaluator {
  private readonly matchers: RuleEvaluatorMatcher[] = [];
  private readonly allowAnonymous: boolean;
  private readonly allowAuthorized: boolean;
  private readonly requiredRole: string | null;

  constructor(private id: string, private rule: Rule) {
    this.allowAnonymous = rule.auth.type === 'anonymous';
    this.allowAuthorized = rule.auth.type === 'authorized' || rule.auth.type === 'role';
    this.requiredRole = rule.auth.type === 'role' ? rule.auth.role : null;
    this.matchers = getRuleMatchers(rule.sql, []);
  }

  private returnResult(errors: RuleErrorResult[], matchCount: number): RuleResult {
    return {
      errors,
      score: matchCount / this.matchers.length,
      conditionsCount: this.matchers.length,
      matchCount,
      type: this.rule.type,
      id: this.id,
    };
  }

  evaluate(auth: RuleContext, sql: any): RuleResult {
    if (!auth.isAuthorized) {
      if (!this.allowAnonymous) {
        return this.returnResult([{ message: 'anonymous is not allowed' }], 0);
      }
    } else {
      if (!this.allowAuthorized) {
        return this.returnResult([{ message: 'authorized is not allowed' }], 0);
      }
      if (this.requiredRole && (!auth.roles || auth.roles.indexOf(this.requiredRole) === -1)) {
        return this.returnResult([{ message: `missing role ${this.requiredRole}` }], 0);
      }
    }

    const errors: RuleErrorResult[] = [];
    let count = 0;
    for (const matcher of this.matchers) {
      const error = matcher(sql, auth);
      if (error) {
        errors.push(error);
      } else {
        count++;
      }
    }

    return this.returnResult(errors, count);
  }
}

export function evaluateRule(sql: any, rule: Rule, ctx: RuleContext): RuleResult;
export function evaluateRule(sql: any, rule: Rule[], ctx: RuleContext): RuleResult | null;
export function evaluateRule(sql: any, rule: Rule | Rule[], ctx: RuleContext): RuleResult | null {
  if (rule instanceof Array) {
    const evaluator = new RulesEvaluator(rule.map((r) => ({ id: getRuleId(r), rule: r })));
    return evaluator.evaluate(ctx, sql);
  } else {
    const evaluator = new RuleEvaluator(getRuleId(rule), rule);
    return evaluator.evaluate(ctx, sql);
  }
}

export function expectMatchingRule(sql: any, rule: Rule, ctx: RuleContext): void;
export function expectMatchingRule(sql: any, rule: Rule[], ctx: RuleContext): void;
export function expectMatchingRule(sql: any, rule: Rule | Rule[], ctx: RuleContext): void {
  let result: RuleResult | null;
  if (rule instanceof Array) {
    result = evaluateRule(sql, rule, ctx);
  } else {
    result = evaluateRule(sql, rule, ctx);
  }

  if (result == null) {
    throw new Error('no rule defined');
  }

  if (result.type === 'forbid') {
    throw new Error(
      `received forbid rule ${result.id}, ${result.errors
        .map((e) => `${e.message} ${e.path ? `(${e.path.join('.')})` : ''}`)
        .join(',')}`,
    );
  }
  if (result.score !== 1) {
    throw new Error(
      `no matching rule ${result.id} score ${result.score}, ${result.errors
        .map((e) => `${e.message} ${e.path ? `(${e.path.join('.')})` : ''}`)
        .join(',')}`,
    );
  }
}

export function expectUnmatchingRule(sql: any, rule: Rule, ctx: RuleContext): void;
export function expectUnmatchingRule(sql: any, rule: Rule[], ctx: RuleContext): void;
export function expectUnmatchingRule(sql: any, rule: Rule | Rule[], ctx: RuleContext): void {
  let result: RuleResult | null;
  if (rule instanceof Array) {
    result = evaluateRule(sql, rule, ctx);
  } else {
    result = evaluateRule(sql, rule, ctx);
  }

  if (result == null) {
    throw new Error('no rule defined');
  }

  if (result.type === 'allow' && result.score === 1) {
    throw new Error(`received allow rule ${result.id}`);
  }
}
