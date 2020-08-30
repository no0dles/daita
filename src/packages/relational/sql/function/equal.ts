import { EqualDescription } from '../description/equal';

export function equal<T>(left: T, right: T): EqualDescription<T> {
  return {
    equal: {
      left,
      right,
    },
  };
}
