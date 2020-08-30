import { ForbidCharactersDescription } from './forbid-characters-description';
import { isExactKind } from '../../../common/utils';

export interface AllowRegexDescription {
  allowRegex: { regExp: RegExp };
}

export const isAllowRegexDescription = (
  val: any,
): val is ForbidCharactersDescription =>
  isExactKind(val, ['allowRegex']) &&
  typeof val.allowRegex === 'object' &&
  isExactKind(val.allowRegex, ['regExp']) &&
  val.allowRegex.regExp instanceof RegExp;
