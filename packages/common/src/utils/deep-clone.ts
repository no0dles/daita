export function deepClone<T extends object>(value: T): T {
  const clone: any = Object.create(value);
  for (const key of Object.keys(value)) {
    const prop = (value as any)[key];
    if (
      typeof prop === 'string' ||
      typeof prop === 'number' ||
      typeof prop === 'boolean' ||
      prop instanceof Date ||
      prop === undefined ||
      prop === null
    ) {
      clone[key] = prop;
    } else if (prop instanceof Array) {
      const cloneArray: any[] = [];
      for (const item of prop) {
        cloneArray.push(deepClone(item));
      }
      clone[key] = cloneArray;
    } else {
      clone[key] = deepClone(prop);
    }
  }
  return clone;
}
