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

export function matchesObject(
  ruleContext: RuleContext,
  authSql: any,
  ctxSql: any,
  path: string[],
): string | null {
  if (isAnything(authSql)) {
    return null;
  } else if (isRequestContext(authSql)) {
    const contextValue = authSql.getContextValue(ruleContext);
    if (ctxSql === contextValue) {
      return null;
    }
    return `${path.join('.')} does not match request context`;
  } else if (isAllowRegex(authSql)) {
    if (typeof ctxSql !== 'string') {
      return `${path.join('.')} should be a string`;
    }
    if (authSql.allowRegex.regExp.test(ctxSql)) {
      return null;
    } else {
      return `${path.join('.')} does not match regexp ${
        authSql.allowRegex.regExp
      }`;
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
      return null;
    } else {
      return `${path.join('.')} ${ctxSql} should be ${authSql}`;
    }
  } else if (authSql instanceof Array || ctxSql instanceof Array) {
    if (authSql instanceof Array && !(ctxSql instanceof Array)) {
      return `${path.join('.')} expected an array`;
    }
    if (!(authSql instanceof Array) && ctxSql instanceof Array) {
      return `${path.join('.')} unexpected array`;
    }
    if (authSql.length !== ctxSql.length) {
      return `${path.join('.')} array length does not match`;
    }
    for (let i = 0; i < authSql.length; i++) {
      const res = matchesObject(ruleContext, authSql[i], ctxSql[i], [
        ...path,
        '0',
      ]);
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
      return `${path.join('.')} requires ${key} value`;
    }
    ctxKeys.splice(index, 1);
  }

  if (ctxKeys.length > 0) {
    return `${path.join('.')} does not allow ${ctxKeys
      .map((k) => k)
      .join(', ')}`;
  }

  for (const key of authKeys) {
    const error = matchesObject(ruleContext, authSql[key], ctxSql[key], [
      ...path,
      key,
    ]);
    if (error) {
      return error;
    }
  }

  return null;
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
      return { type: 'next' };
    }

    const error = matchesObject(ctx, rule.sql, sql, []);
    if (!error) {
      return { type: 'allow' };
    }

    return { type: 'next', error };
  } else if (rule.type === 'forbid') {
    if (!matchesAuthsDescription(rule.auth, ctx)) {
      return { type: 'next' };
    }

    const error = matchesObject(ctx, rule.sql, sql, []);
    if (error) {
      return { type: 'forbid', error, details: [] };
    }
    return { type: 'next' };
  } else {
    failNever(rule.type, 'unknown rule type');
  }
}

export function validateRules(
  sql: Sql<any>,
  rules: Rule[],
  ctx: RuleContext,
): RuleValidateAllowResult | RuleValidateForbidResult {
  const details: { message: string; ruleId: string }[] = [];
  for (const rule of rules) {
    const res = evaluateRule(sql, rule, ctx);
    if (res.type === 'allow' || res.type === 'forbid') {
      return res;
    } else if (res.error) {
      details.push({ message: res.error, ruleId: getRuleId(rule) });
    }
  }
  return { type: 'forbid', error: 'no matching rule', details };
}
