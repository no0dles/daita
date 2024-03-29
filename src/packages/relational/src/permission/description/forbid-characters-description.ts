import { isExactKind } from '@daita/common';

export interface ForbidCharactersDescription {
  forbidCharacters: { characters: string };
}

export const isForbidCharactersDescription = (val: any): val is ForbidCharactersDescription =>
  isExactKind(val, ['forbidCharacters']) &&
  typeof val.forbidCharacters === 'object' &&
  isExactKind(val.forbidCharacters, ['characters']);
