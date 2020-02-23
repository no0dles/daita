export function merge(
  currentItems: string[],
  newItems: string[],
  functions: {
    add?: (item: string) => void;
    remove?: (item: string) => void;
    merge?: (item: string) => void;
  },
) {
  const leftItems = [...newItems];
  for (const currentItem of currentItems) {
    const index = leftItems.indexOf(currentItem);
    if (index >= 0) {
      leftItems.splice(index, 1);
      if (functions.merge) {
        functions.merge(currentItem);
      }
    } else {
      if (functions.remove) {
        functions.remove(currentItem);
      }
    }
  }

  for (const leftItem of leftItems) {
    if (functions.add) {
      functions.add(leftItem);
    }
  }
}

export function mergeList<T>(
  currentItems: T[],
  newItems: T[],
  functions: {
    compare: (first: T, second: T) => boolean;
    add: (item: T) => void;
    remove: (item: T) => void;
    merge: (currentItem: T, newItem: T) => void;
  },
) {
  const leftItems = [...newItems];
  for (const currentItem of currentItems) {
    const newItem = newItems.filter(newItem =>
      functions.compare(newItem, currentItem),
    )[0];
    if (newItem) {
      const index = leftItems.indexOf(newItem);
      leftItems.splice(index, 1);
      functions.merge(currentItem, newItem);
    } else {
      functions.remove(currentItem);
    }
  }

  for (const leftItem of leftItems) {
    functions.add(leftItem);
  }
}

export function capitalize(word: string) {
  if (!word) {
    return word;
  }
  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

export function getMigrationName(name: string) {
  return capitalize(name) + 'Migration';
}