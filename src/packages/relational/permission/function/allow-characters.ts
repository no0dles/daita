import { AllowCharactersDescription } from '../description/allow-characters-description';

export function allowCharacters(characters: string): string {
  return (<AllowCharactersDescription>{
    allowCharacters: { characters },
  }) as any;
}
