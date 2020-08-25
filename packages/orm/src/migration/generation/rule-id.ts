import { Rule } from '@daita/relational';
import * as crypto from 'crypto';

export function getRuleId(rule: Rule): string {
  const content = JSON.stringify(rule);
  const hash = crypto.createHash('sha256');
  return hash.update(content).digest('hex');
}
