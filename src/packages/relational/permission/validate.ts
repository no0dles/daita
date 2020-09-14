import { isAnything } from './function/anything';
import { AuthDescription } from './description/auth-description';
import { Sql } from '../sql';
import { Rule } from './description/rule';
import { RuleValidateAllowResult } from './description/rule-validation-allow-result';
import { RuleValidateForbidResult } from './description/rule-validation-forbid-result';
import { isAllowRegex, isRequestContext } from './function';
import { RuleContext, RuleValidateResult } from './description';
import { failNever } from '../../common/utils';
import { getRuleId } from '../../orm/migration/generation';

export type MatchResult = MatchesResult | MismatchResult;

export interface MatchesResult {
  matches: true;
  score: number;
}

export interface MismatchResult {
  matches: false;
  message: string;
  score: number;
  path: string[];
}

export function matchesObject(
  ruleContext: RuleContext,
  authSql: any,
  ctxSql: any,
  path: string[],
  score: number,
): MatchResult {
  if (isAnything(authSql)) {
    return { matches: true, score };
  } else if (isRequestContext(authSql)) {
    const contextValue = authSql.getContextValue(ruleContext);
    if (ctxSql === contextValue) {
      return { matches: true, score };
    }
    return {
      matches: false,
      message: `should match to request context value "${contextValue}"`,
      path: path,
      score,
    };
  } else if (isAllowRegex(authSql)) {
    if (typeof ctxSql !== 'string') {
      return {
        message: 'should be a string',
        matches: false,
        path,
        score,
      };
    }
    if (authSql.allowRegex.regExp.test(ctxSql)) {
      return {
        matches: true,
        score,
      };
    } else {
      return {
        score,
        matches: false,
        path,
        message: `should match regexp ${authSql.allowRegex.regExp}`,
      };
    }
  } else if (
    typeof authSql === 'string' ||
    typeof ctxSql === 'string' ||
    typeof authSql === 'boolean' ||
    typeof ctxSql === 'boolean' ||
    typeof authSql === 'number' ||
    typeof ctxSql === 'number'
  ) {
    if (authSql === ctxSql) {
      return {
        matches: true,
        score,
      };
    } else {
      return {
        path,
        matches: false,
        score,
        message: `should be equal to "${authSql}"`,
      };
    }
  } else if (authSql instanceof Array || ctxSql instanceof Array) {
    if (authSql instanceof Array && !(ctxSql instanceof Array)) {
      return {
        path,
        matches: false,
        score,
        message: 'should be an array',
      };
    }
    if (!(authSql instanceof Array) && ctxSql instanceof Array) {
      return {
        path,
        matches: false,
        score,
        message: 'should not be an array',
      };
    }
    if (authSql.length !== ctxSql.length) {
      return {
        path,
        matches: false,
        score,
        message: `should have array length of ${authSql.length}`,
      };
    }
    for (let i = 0; i < authSql.length; i++) {
      const res = matchesObject(
        ruleContext,
        authSql[i],
        ctxSql[i],
        [...path, '0'],
        score + 1,
      );
      if (res) {
        return res;
      }
    }
  }

  const authKeys = Object.keys(authSql);
  const ctxKeys = Object.keys(ctxSql);

  for (const key of authKeys) {
    const index = ctxKeys.indexOf(key);
    if (index === -1) {
      return {
        message: `should contain "${key}"`,
        path,
        score,
        matches: false,
      };
    }
    ctxKeys.splice(index, 1);
  }

  if (ctxKeys.length > 0) {
    const keys = ctxKeys.map((k) => `"${k}"`).join(', ');
    return {
      matches: false,
      path,
      score,
      message: `should not contain ${keys}`,
    };
  }

  for (const key of authKeys) {
    const result = matchesObject(
      ruleContext,
      authSql[key],
      ctxSql[key],
      [...path, key],
      score + 1,
    );
    if (result) {
      return result;
    }
  }

  return { matches: true, score };
}

export function matchesAuthsDescription(
  auths: AuthDescription[] | AuthDescription,
  ctx: RuleContext,
): boolean {
  if (auths instanceof Array) {
    for (const item of auths) {
      if (matchesAuthDescription(item, ctx)) {
        return true;
      }
    }
    return false;
  } else {
    return matchesAuthDescription(auths, ctx);
  }
}

export function matchesAuthDescription(
  auth: AuthDescription,
  ctx: RuleContext,
): boolean {
  if (auth.type === 'anonymous') {
    return !ctx.isAuthorized;
  } else if (auth.type === 'authorized') {
    return ctx.isAuthorized;
  } else {
    failNever(auth, 'unknown auth description');
  }
}

export function matchesRules(
  sql: Sql<any>,
  rules: Rule[],
  ctx: RuleContext,
): boolean {
  const res = validateRules(sql, rules, ctx);
  return res.type === 'allow';
}

export function evaluateRule(
  sql: Sql<any>,
  rule: Rule,
  ctx: RuleContext,
): RuleValidateResult {
  if (rule.type === 'allow') {
    if (!matchesAuthsDescription(rule.auth, ctx)) {
      return {
        type: 'next',
        error: 'did not match auth description',
        path: [],
        score: 0,
      };
    }

    const error = matchesObject(ctx, rule.sql, sql, [], 1);
    if (error.matches) {
      return { type: 'allow' };
    }

    return {
      type: 'next',
      error: error.message,
      path: error.path,
      score: error.score,
    };
  } else if (rule.type === 'forbid') {
    if (!matchesAuthsDescription(rule.auth, ctx)) {
      return {
        type: 'next',
        error: 'did not match auth description',
        path: [],
        score: 0,
      };
    }

    const error = matchesObject(ctx, rule.sql, sql, [], 1);
    if (error.matches) {
      return {
        type: 'forbid',
        error: 'should not match forbid rule',
        ruleId: getRuleId(rule),
      };
    }
    return { type: 'next', error: '', score: 0, path: [] }; // TODO not optimal type
  } else {
    failNever(rule.type, 'unknown rule type');
  }
}

export function validateRules(
  sql: Sql<any>,
  rules: Rule[],
  ctx: RuleContext,
): RuleValidateAllowResult | RuleValidateForbidResult {
  let error: {
    ruleId: string;
    error: string;
    score: number;
    path: string[];
  } | null = null;
  for (const rule of rules) {
    const res = evaluateRule(sql, rule, ctx);
    if (res.type === 'allow' || res.type === 'forbid') {
      return res;
    } else if (!error || res.score > error.score) {
      error = {
        error: res.error,
        ruleId: getRuleId(rule),
        score: res.score,
        path: res.path,
      };
    }
  }
  if (error) {
    return {
      type: 'forbid',
      error: error?.error,
      path: error?.path,
      ruleId: error?.ruleId,
    };
  } else {
    return { type: 'forbid', error: 'no rules defined' };
  }
}
