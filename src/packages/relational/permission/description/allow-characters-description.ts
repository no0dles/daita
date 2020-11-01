import { isExactKind } from '../../../common/utils/is-exact-kind';

export interface AllowCharactersDescription {
  allowCharacters: { characters: string };
}

export const isAllowCharactersDescription = (val: any): val is AllowCharactersDescription =>
  isExactKind(val, ['allowCharacters']) &&
  typeof val.allowCharacters === 'object' &&
  isExactKind(val.allowCharacters, ['characters']);
