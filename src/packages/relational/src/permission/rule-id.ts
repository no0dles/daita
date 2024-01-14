import { Rule } from './description/rule';

export function getRuleId(rule: Rule): string {
  const content = JSON.stringify(rule);
  let a = 1,
    c = 0,
    h,
    o;
  if (content) {
    a = 0;
    for (h = content.length - 1; h >= 0; h--) {
      o = content.charCodeAt(h);
      a = ((a << 6) & 268435455) + o + (o << 14);
      c = a & 266338304;
      a = c !== 0 ? a ^ (c >> 21) : a;
    }
  }
  return String(a);
}
