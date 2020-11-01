import { ForbidCharactersDescription } from './forbid-characters-description';
import { isExactKind } from '../../../common/utils/is-exact-kind';

export interface ForbidRegexDescription {
  forbidRegex: { regExp: RegExp };
}

export const isForbidRegexDescription = (val: any): val is ForbidCharactersDescription =>
  isExactKind(val, ['forbidRegex']) &&
  typeof val.forbidRegex === 'object' &&
  isExactKind(val.forbidRegex, ['regExp']) &&
  val.forbidRegex.regExp instanceof RegExp;
