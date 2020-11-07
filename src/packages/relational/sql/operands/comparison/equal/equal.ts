import { EqualDescription } from './equal-description';

export function equal<T>(left: T, right: T): EqualDescription<T> {
  return {
    equal: {
      left,
      right,
    },
  };
}
