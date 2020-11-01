import { LowerEqualThanDescription } from '../description/lower-equal-than';

export function lowerEqualThan<T extends number | Date>(left: T, right: T): LowerEqualThanDescription<T> {
  return {
    lowerEqualThan: {
      left,
      right,
    },
  };
}
