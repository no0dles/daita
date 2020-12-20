export interface MergeListResult<T> {
  added: { key: string; item: T }[];
  removed: { key: string; item: T }[];
  merge: { current: T; target: T; key: string }[];
}

export interface MergeArrayResult {
  added: string[];
  removed: string[];
}

export function mergeArray(currentItems: string[], newItems: string[]): MergeArrayResult {
  return {
    added: newItems.filter((newItem) => currentItems.indexOf(newItem) === -1),
    removed: currentItems.filter((currentItem) => newItems.indexOf(currentItem) === -1),
  };
}

export function merge<T>(currentItems: { [key: string]: T }, newItems: { [key: string]: T }): MergeListResult<T> {
  const leftItemKeys = Object.keys(newItems);
  const result: MergeListResult<T> = { added: [], merge: [], removed: [] };
  for (const currentItemKey of Object.keys(currentItems)) {
    const newItemIndex = leftItemKeys.indexOf(currentItemKey);
    if (newItemIndex >= 0) {
      leftItemKeys.splice(newItemIndex, 1);
      result.merge.push({
        current: currentItems[currentItemKey],
        target: newItems[currentItemKey],
        key: currentItemKey,
      });
    } else {
      result.removed.push({ key: currentItemKey, item: currentItems[currentItemKey] });
    }
  }

  for (const leftItemKey of leftItemKeys) {
    result.added.push({ key: leftItemKey, item: newItems[leftItemKey] });
  }

  return result;
}
