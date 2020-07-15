import { Rule } from './description';
import { allow, forbid, reviveRequestContext } from './function';

export function parsing(content: string): Rule[] {
  const rules = JSON.parse(content, (key, value) => {
    if (key === '$requestContext') {
      return reviveRequestContext(value);
    } else if (typeof value === 'object') {
      if (value['$requestContext']) {
        return value['$requestContext'];
      }
    }
    return value;
  });
  const result: Rule[] = [];
  for (const rule of rules) {
    if (rule.type === 'allow') {
      result.push(allow(rule.auth, rule.sql));
    } else if (rule.type === 'forbid') {
      result.push(forbid(rule.auth, rule.sql));
    } else {
      throw new Error(`unknown rule type ${rule.type}`);
    }
  }
  return result;
}
