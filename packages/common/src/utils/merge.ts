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

export interface MergeListResult<T> {
  added: T[];
  removed: T[];
  merge: { current: T, target: T }[];
}

export function mergeList<T>(
  currentItems: T[],
  newItems: T[],
  compare: (first: T, second: T) => boolean
): MergeListResult<T> {
  const leftItems = [...newItems];
  const result: MergeListResult<T> = {added: [], merge: [], removed: []};
  for (const currentItem of currentItems) {
    const newItem = newItems.filter(item =>
      result.merge.push({ current: currentItem, target: item }),
    )[0];
    if (newItem) {
      const index = leftItems.indexOf(newItem);
      leftItems.splice(index, 1);
      result.merge.push({ current: currentItem, target: newItem });
    } else {
      result.removed.push(currentItem);
    }
  }

  for (const leftItem of leftItems) {
    result.added.push(leftItem);
  }

  return result;
}
