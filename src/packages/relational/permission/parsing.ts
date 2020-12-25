import { allow } from './function/allow';
import { reviveRequestContext } from './function/request-context';
import { forbid } from './function/forbid';
import { Rule } from './description/rule';

export function serializeRules(rules: Rule[]): string {
  return JSON.stringify(rules, replacer);
}

export function serializeRule(rule: Rule): string {
  return JSON.stringify(rule, replacer);
}

const replacer = (key: string, value: any) => {
  if (value instanceof RegExp) {
    return { $regex: value.toString() };
  } else {
    return value;
  }
};

export function parseRules(content: string): Rule[] {
  const rules = reviveRuleJson<Rule[]>(content);
  const result: Rule[] = [];
  for (const rule of rules) {
    result.push(restoreRule(rule));
  }
  return result;
}

export function parseRule(content: string): Rule {
  const rule = reviveRuleJson<Rule>(content);
  return restoreRule(rule);
}

function restoreRule(rule: Rule): Rule {
  if (rule.type === 'allow') {
    return allow(rule.auth, rule.sql);
  } else if (rule.type === 'forbid') {
    return forbid(rule.auth, rule.sql);
  } else {
    throw new Error(`unknown rule type ${rule.type}`);
  }
}

export function reviveRuleObject(obj: any): any {
  if (obj instanceof Array) {
    return obj.map((item) => reviveRuleObject(item));
  } else if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || obj instanceof Date) {
    return obj;
  } else if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      if (key === '$requestContext') {
        return reviveRequestContext(obj[key]);
      } else if (key === '$regex') {
        return new RegExp(obj['$regex'].substr(1, obj['$regex'].length - 2));
      } else {
        newObj[key] = reviveRuleObject(obj[key]);
      }
    }
    return newObj;
  } else {
    return obj;
  }
}

export function reviveRuleJson<T>(content: string): T {
  return JSON.parse(content, (key, value) => {
    if (key === '$requestContext') {
      return reviveRequestContext(value);
    } else if (typeof value === 'object') {
      if (value['$requestContext']) {
        return value['$requestContext'];
      } else if (value['$regex']) {
        return new RegExp(value['$regex'].substr(1, value['$regex'].length - 2));
      }
    }
    return value;
  });
}
