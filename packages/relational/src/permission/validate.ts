import { isAnything } from './function/anything';
import { AuthDescription } from './description/auth-description';
import { Sql } from '../sql';
import { Rule } from './description/rule';
import { RuleValidateAllowResult } from './description/rule-validation-allow-result';
import { RuleValidateForbidResult } from './description/rule-validation-forbid-result';
import { failNever } from '@daita/common';
import { isAllowRegex, isRequestContext } from './function';
import { RuleContext } from './description';

export function matchesObject(ruleContext: RuleContext, authSql: any, ctxSql: any, path: string[]): string | null {
  if (isAnything(authSql)) {
    return null;
  } else if(isRequestContext(authSql)) {
    const contextValue = authSql.getContextValue(ruleContext);
    if(ctxSql === contextValue) {
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
      return `${path.join('.')} does not match regexp`;
    }
  } else if (typeof authSql === 'string' || typeof ctxSql === 'string' ||
    typeof authSql === 'boolean' || typeof ctxSql === 'boolean' ||
    typeof authSql === 'number' || typeof ctxSql === 'number' ||
    authSql instanceof Array || ctxSql instanceof Array) {
    if (authSql === ctxSql) {
      return null;
    } else {
      return `${path.join('.')} ${ctxSql} should be ${authSql}`;
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
    return `${path.join('.')} does not allow ${ctxKeys.map(k => k).join(', ')}`;
  }

  for (const key of authKeys) {
    const error = matchesObject(ruleContext, authSql[key], ctxSql[key], [...path, key]);
    if (error) {
      return error;
    }
  }

  return null;
}

export function matchesAuthsDescription(auths: AuthDescription[] | AuthDescription, ctx: RuleContext): boolean {
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

export function matchesAuthDescription(auth: AuthDescription, ctx: RuleContext): boolean {
  if (auth.type === 'anonymous') {
    return !ctx.isAuthorized;
  } else if (auth.type === 'authorized') {
    return ctx.isAuthorized;
  } else {
    failNever(auth, 'unknown auth description');
  }
}

export function matchesRules(sql: Sql<any>, rules: Rule[], ctx: RuleContext): boolean {
  const res = validateRules(sql, rules, ctx);
  return res.type === 'allow';
}

export function validateRules(sql: Sql<any>, rules: Rule[], ctx: RuleContext): RuleValidateAllowResult | RuleValidateForbidResult {
  for (const rule of rules) {
    const res = rule.validate(sql, ctx);
    if (res.type === 'allow' || res.type === 'forbid') {
      return res;
    }
  }
  return { type: 'forbid', error: 'no matching rule' };
}
