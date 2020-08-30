import { isKind } from './is-kind';

export function isExactKind<T>(val: any, props: (keyof Required<T>)[]): val is T {
  if (!val) {
    return false;
  }

  const keys = Object.keys(val);
  if (keys.length !== props.length) {
    return false;
  }

  return isKind(val, props);
}
