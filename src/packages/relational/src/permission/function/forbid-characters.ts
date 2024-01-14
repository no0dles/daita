import { ForbidCharactersDescription } from '../description/forbid-characters-description';

export function forbidCharacters(characters: string): string {
  return (<ForbidCharactersDescription>{
    forbidCharacters: { characters },
  }) as any;
}
