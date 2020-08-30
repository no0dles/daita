export interface MergeListResult<T> {
  added: T[];
  removed: T[];
  merge: { current: T; target: T }[];
}

export function merge<T>(
  currentItems: T[],
  newItems: T[],
  compare: (first: T, second: T) => boolean,
): MergeListResult<T> {
  const leftItems = [...newItems];
  const result: MergeListResult<T> = { added: [], merge: [], removed: [] };
  for (const currentItem of currentItems) {
    const newItem = leftItems.find((item) => compare(item, currentItem));
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
