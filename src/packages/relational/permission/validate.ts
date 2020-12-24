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
  errors: RuleErrorResult[];
}

export interface RuleErrorResult {
  path: string[];
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

  evaluate(auth: RuleContext, sql: any): RuleResult {
    if (!auth.isAuthorized) {
      if (!this.allowAnonymous) {
        return {
          errors: [],
          score: 0,
          type: this.rule.type,
          id: this.id,
        };
      }
    } else {
      if (!this.allowAuthorized) {
        return {
          errors: [],
          score: 0,
          type: this.rule.type,
          id: this.id,
        };
      }
      if (this.requiredRole && (!auth.roles || auth.roles.indexOf(this.requiredRole) === -1)) {
        return {
          errors: [],
          score: 0,
          type: this.rule.type,
          id: this.id,
        };
      }
    }

    const errors: RuleErrorResult[] = [];
    for (const matcher of this.matchers) {
      const error = matcher(sql, auth);
      if (error) {
        errors.push(error);
      }
    }

    return {
      errors,
      id: this.id,
      type: this.rule.type,
      score: 1 - errors.length / this.matchers.length,
    };
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
      `received forbid rule ${result.id}, ${result.errors.map((e) => `${e.message} (${e.path.join('.')})`).join(',')}`,
    );
  }
  if (result.score !== 1) {
    throw new Error(
      `no matching rule ${result.id} score ${result.score}, ${result.errors
        .map((e) => `${e.message} (${e.path.join('.')})`)
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
//
// export const isMismatchResult = (val: MatchResult): val is MismatchResult => !val.matches;
//
// export function matchesObject(
//   ruleContext: RuleContext,
//   authSql: any,
//   ctxSql: any,
//   path: string[],
//   score: number,
// ): MatchResult {
//   if (authSql instanceof Array || ctxSql instanceof Array) {
//     if (authSql instanceof Array && !(ctxSql instanceof Array)) {
//       return {
//         path,
//         matches: false,
//         score,
//         message: 'should be an array',
//       };
//     }
//     if (!(authSql instanceof Array) && ctxSql instanceof Array) {
//       return {
//         path,
//         matches: false,
//         score,
//         message: 'should not be an array',
//       };
//     }
//     if (authSql.length !== ctxSql.length) {
//       return {
//         path,
//         matches: false,
//         score,
//         message: `should have array length of ${authSql.length}`,
//       };
//     }
//     for (let i = 0; i < authSql.length; i++) {
//       const res = matchesObject(ruleContext, authSql[i], ctxSql[i], [...path, '0'], score + 1);
//       if (res) {
//         return res;
//       }
//     }
//   }
//
//   const authKeys = Object.keys(authSql);
//   const ctxKeys = Object.keys(ctxSql);
//
//   for (const key of authKeys) {
//     const index = ctxKeys.indexOf(key);
//     if (index === -1) {
//       return {
//         message: `should contain "${key}"`,
//         path,
//         score,
//         matches: false,
//       };
//     }
//     ctxKeys.splice(index, 1);
//   }
//
//   if (ctxKeys.length > 0) {
//     const keys = ctxKeys.map((k) => `"${k}"`).join(', ');
//     return {
//       matches: false,
//       path,
//       score,
//       message: `should not contain ${keys}`,
//     };
//   }
//
//   for (const key of authKeys) {
//     const result = matchesObject(ruleContext, authSql[key], ctxSql[key], [...path, key], score + 1);
//     if (!result.matches) {
//       return result;
//     }
//   }
//
//   return { matches: true, score };
// }
//
// export function matchesAuthsDescription(auths: AuthDescription[] | AuthDescription, ctx: RuleContext): boolean {
//   if (auths instanceof Array) {
//     for (const item of auths) {
//       if (matchesAuthDescription(item, ctx)) {
//         return true;
//       }
//     }
//     return false;
//   } else {
//     return matchesAuthDescription(auths, ctx);
//   }
// }
//
// export function matchesAuthDescription(auth: AuthDescription, ctx: RuleContext): boolean {
//   if (auth.type === 'anonymous') {
//     return !ctx.isAuthorized;
//   } else if (auth.type === 'authorized') {
//     return ctx.isAuthorized;
//   } else if (auth.type === 'role') {
//     return ctx.roles instanceof Array && ctx.roles.indexOf(auth.role) >= 0;
//   } else {
//     failNever(auth, 'unknown auth description');
//   }
// }
//
// export function matchesRules(sql: Sql<any>, rules: Rule[], ctx: RuleContext): boolean {
//   const res = validateRules(sql, rules, ctx);
//   return res.type === 'allow';
// }
//
// export function evaluateRule(sql: Sql<any>, rule: Rule, ctx: RuleContext): RuleValidateResult {
//   if (rule.type === 'allow') {
//     if (!matchesAuthsDescription(rule.auth, ctx)) {
//       return {
//         type: 'next',
//         error: 'did not match auth description',
//         path: [],
//         score: 0,
//       };
//     }
//
//     const error = matchesObject(ctx, rule.sql, sql, [], 1);
//     if (!isMismatchResult(error)) {
//       return { type: 'allow' };
//     }
//
//     return {
//       type: 'next',
//       error: error.message,
//       path: error.path,
//       score: error.score,
//     };
//   } else if (rule.type === 'forbid') {
//     if (!matchesAuthsDescription(rule.auth, ctx)) {
//       return {
//         type: 'next',
//         error: 'did not match auth description',
//         path: [],
//         score: 0,
//       };
//     }
//
//     const error = matchesObject(ctx, rule.sql, sql, [], 1);
//     if (error.matches) {
//       return {
//         type: 'forbid',
//         error: 'should not match forbid rule',
//         ruleId: getRuleId(rule),
//       };
//     }
//     return { type: 'next', error: '', score: 0, path: [] }; // TODO not optimal type
//   } else {
//     failNever(rule.type, 'unknown rule type');
//   }
// }
//
// export function validateRules(
//   sql: Sql<any>,
//   rules: Rule[],
//   ctx: RuleContext,
// ): RuleValidateAllowResult | RuleValidateForbidResult {
//   let error: {
//     ruleId: string;
//     error: string;
//     score: number;
//     path: string[];
//   } | null = null;
//   for (const rule of rules) {
//     const res = evaluateRule(sql, rule, ctx);
//     if (res.type === 'allow' || res.type === 'forbid') {
//       return res;
//     } else if (!error || res.score > error.score) {
//       error = {
//         error: res.error,
//         ruleId: getRuleId(rule),
//         score: res.score,
//         path: res.path,
//       };
//     }
//   }
//   if (error) {
//     return {
//       type: 'forbid',
//       error: error?.error,
//       path: error?.path,
//       ruleId: error?.ruleId,
//     };
//   } else {
//     return { type: 'forbid', error: 'no rules defined' };
//   }
// }
