import { GreaterEqualThanDescription } from '../description/greater-equal-than';

export function greaterEqualThan<T extends number | Date>(left: T, right: T): GreaterEqualThanDescription<T> {
  return {
    greaterEqualThan: {
      left,
      right,
    },
  };
}
