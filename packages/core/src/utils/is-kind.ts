export function isKind<T>(val: any, props: (keyof Required<T>)[]): val is T {
  if (!val) {
    return false;
  }

  for (const prop of props) {
    if (!val.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
}
