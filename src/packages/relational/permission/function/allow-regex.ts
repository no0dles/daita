import { AllowRegexDescription } from '../description';
import { isExactKind } from '../../../common/utils';

export function allowRegex(regExp: RegExp): string {
  return (<AllowRegexDescription>{ allowRegex: { regExp } }) as any;
}

export const isAllowRegex = (val: any): val is AllowRegexDescription =>
  isExactKind(val, ['allowRegex']) &&
  typeof val.allowRegex === 'object' &&
  isExactKind(val.allowRegex, ['regExp']) &&
  val.allowRegex.regExp instanceof RegExp;