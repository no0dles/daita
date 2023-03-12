export function extendMergeResult<S, T>(source: MergeListResult<S>, extend: (source: S) => T): MergeListResult<T> {
  return {
    added: source.added.map((added) => ({
      key: added.key,
      item: extend(added.item),
    })),
    removed: source.removed.map((removed) => ({
      key: removed.key,
      item: extend(removed.item),
    })),
    merge: source.merge.map((merge) => ({
      key: merge.key,
      current: extend(merge.current),
      target: extend(merge.target),
    })),
  };
}
