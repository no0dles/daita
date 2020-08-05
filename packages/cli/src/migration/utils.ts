export function capitalize(word: string) {
  if (!word) {
    return word;
  }
  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

export function splitByIrregularCharacters(text: string, regularCharacters: string): string[] {
  const result: string[] = [];
  let current = '';
  for (const char of text) {
    if (regularCharacters.indexOf(char) >= 0) {
      current += char;
    } else if (current.length > 0) {
      result.push(current);
      current = '';
    }
  }

  if (current.length > 0) {
    result.push(current);
  }

  return result;
}

export function getMigrationName(name: string) {
  const migrationName = splitByIrregularCharacters(name, 'ABCDEFGHIJKLMNOPQRSTUVWXZYabcdefghijklmnopqrstuvwxyz0123456789')
    .map(text => capitalize(text))
    .join('');
  return `${migrationName}Migration`;
}
