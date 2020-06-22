import { isExactKind } from '@daita/common';

export interface AllowCharactersDescription {
  allowCharacters: { characters: string };
}

export const isAllowCharactersDescription = (val: any): val is AllowCharactersDescription => isExactKind(val, ['allowCharacters']) &&
  typeof val.allowCharacters === 'object' &&
  isExactKind(val.allowCharacters, ['characters']);
