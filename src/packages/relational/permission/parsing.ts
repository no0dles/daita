import { Rule } from './description';
import { allow, forbid, reviveRequestContext } from './function';

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

function reviveRuleJson<T>(content: string): T {
  return JSON.parse(content, (key, value) => {
    if (key === '$requestContext') {
      return reviveRequestContext(value);
    } else if (typeof value === 'object') {
      if (value['$requestContext']) {
        return value['$requestContext'];
      }
    }
    return value;
  });
}
