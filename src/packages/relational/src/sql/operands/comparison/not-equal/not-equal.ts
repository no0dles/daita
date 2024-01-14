import { NotEqualDescription } from './not-equal-description';

export function notEqual<T>(left: T, right: T): NotEqualDescription<T> {
  return {
    notEqual: {
      left,
      right,
    },
  };
}
