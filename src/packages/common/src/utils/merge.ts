export interface MergeListResult<T> {
  added: { key: string; item: T }[];
  removed: { key: string; item: T }[];
  merge: { current: T; target: T; key: string }[];
}

export interface MergeArrayResult {
  added: string[];
  removed: string[];
}

export function mergeArray(
  currentItems: string[] | null | undefined,
  newItems: string[] | null | undefined,
): MergeArrayResult {
  const currentItemsArray: string[] = currentItems || [];
  const newItemsArray: string[] = newItems || [];
  return {
    added: newItemsArray.filter((newItem) => currentItemsArray.indexOf(newItem) === -1),
    removed: currentItemsArray.filter((currentItem) => newItemsArray.indexOf(currentItem) === -1),
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
