export function isKind<T>(val: any, props: (keyof Required<T>)[]): val is T {
  if (!val) {
    return false;
  }

  for (const prop of props) {
    if (!Object.prototype.hasOwnProperty.call(val, prop) || val[prop] === undefined || val[prop] === null) {
      return false;
    }
  }
  return true;
}
