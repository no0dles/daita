import { GreaterEqualThanDescription } from './greater-equal-than-description';

export function greaterEqualThan<T extends number | Date>(left: T, right: T): GreaterEqualThanDescription<T> {
  return {
    greaterEqualThan: {
      left,
      right,
    },
  };
}
