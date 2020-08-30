import { AllowCharactersDescription } from '../description';

export function allowCharacters(characters: string): string {
  return (<AllowCharactersDescription>{
    allowCharacters: { characters },
  }) as any;
}
