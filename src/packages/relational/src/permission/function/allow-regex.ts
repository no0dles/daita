import { isExactKind } from '@daita/common/utils/is-exact-kind';
import { AllowRegexDescription } from '../description/allow-regex-description';

export function allowRegex(regExp: RegExp): string {
  return (<AllowRegexDescription>{ allowRegex: { regExp: regExp.toString() } }) as any;
}

export const isAllowRegex = (val: any): val is AllowRegexDescription =>
  isExactKind(val, ['allowRegex']) &&
  typeof val.allowRegex === 'object' &&
  isExactKind(val.allowRegex, ['regExp']) &&
  typeof val.allowRegex.regExp === 'string';
