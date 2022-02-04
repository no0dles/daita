export function* traverseObject<T>(obj: any, filter: (val: any) => val is T): Generator<T> {
  if (obj === null || obj === undefined) {
    return;
  }

  if (filter(obj)) {
    yield obj;
  }

  if (typeof obj === 'object') {
    if (obj instanceof Array) {
      for (const item of obj) {
        for (const subObject of traverseObject(item, filter)) {
          yield subObject;
        }
      }
    } else if (!(obj instanceof Date)) {
      const keys = Object.keys(obj);
      for (const key of keys) {
        for (const subObject of traverseObject(obj[key], filter)) {
          yield subObject;
        }
      }
    }
  }
}
