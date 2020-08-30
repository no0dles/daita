import { NotEqualDescription } from '../description/not-equal';

export function notEqual<T>(left: T, right: T): NotEqualDescription<T> {
  return {
    notEqual: {
      left,
      right,
    },
  };
}
