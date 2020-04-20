

export function capitalize(word: string) {
  if (!word) {
    return word;
  }
  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

export function getMigrationName(name: string) {
  return capitalize(name) + 'Migration';
}
