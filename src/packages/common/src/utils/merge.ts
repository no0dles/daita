export interface MergeListResult<T> {
  added: { key: string; item: T }[];
  removed: { key: string; item: T }[];
  merge: { current: T; target: T; key: string }[];
}

export interface MergeArrayResult<T> {
  added: T[];
  removed: T[];
  hasChanges: boolean;
}

export function mergeArray(
  currentItems: string[] | null | undefined,
  newItems: string[] | null | undefined,
): MergeArrayResult<string>;
export function mergeArray(
  currentItems: number[] | null | undefined,
  newItems: number[] | null | undefined,
): MergeArrayResult<number>;
export function mergeArray<T>(
  currentItems: T[] | null | undefined,
  newItems: T[] | null | undefined,
  compareFn: (first: T, second: T) => boolean,
): MergeArrayResult<T>;
export function mergeArray<T>(
  currentItems: T[] | null | undefined,
  newItems: T[] | null | undefined,
  compareFn?: (first: T, second: T) => boolean,
): MergeArrayResult<T> {
  const currentItemsArray: T[] = currentItems || [];
  const newItemsArray: T[] = newItems || [];

  const added = newItemsArray.filter((newItem) => {
    if (compareFn) {
      return !currentItemsArray.find((currentItem) => compareFn(currentItem, newItem));
    }
    return currentItemsArray.indexOf(newItem) === -1;
  });
  const removed = currentItemsArray.filter((currentItem) => {
    if (compareFn) {
      return !newItemsArray.find((newItem) => compareFn(currentItem, newItem));
    }
    return newItemsArray.indexOf(currentItem) === -1;
  });

  return {
    added,
    removed,
    hasChanges: added.length > 0 || removed.length > 0,
  };
}

export function merge<T>(
  currentItems: { [key: string]: T } | undefined | null,
  newItems: { [key: string]: T } | undefined | null,
): MergeListResult<T> {
  const currentItemMap = currentItems || {};
  const newItemMap = newItems || {};
  const leftItemKeys = Object.keys(newItemMap);
  const result: MergeListResult<T> = { added: [], merge: [], removed: [] };
  for (const currentItemKey of Object.keys(currentItems || {})) {
    const newItemIndex = leftItemKeys.indexOf(currentItemKey);
    if (newItemIndex >= 0) {
      leftItemKeys.splice(newItemIndex, 1);
      result.merge.push({
        current: currentItemMap[currentItemKey],
        target: newItemMap[currentItemKey],
        key: currentItemKey,
      });
    } else {
      result.removed.push({ key: currentItemKey, item: currentItemMap[currentItemKey] });
    }
  }

  for (const leftItemKey of leftItemKeys) {
    result.added.push({ key: leftItemKey, item: newItemMap[leftItemKey] });
  }

  return result;
}
