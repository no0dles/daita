import { ForbidCharactersDescription } from './forbid-characters-description';
import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface AllowRegexDescription {
  allowRegex: { regExp: string };
}

export const isAllowRegexDescription = (val: any): val is ForbidCharactersDescription =>
  isExactKind(val, ['allowRegex']) &&
  typeof val.allowRegex === 'object' &&
  isExactKind(val.allowRegex, ['regExp']) &&
  val.allowRegex.regExp instanceof RegExp;
