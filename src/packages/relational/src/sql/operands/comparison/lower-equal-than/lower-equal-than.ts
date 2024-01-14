import { LowerEqualThanDescription } from './lower-equal-than-description';

export function lowerEqualThan<T extends number | Date>(left: T, right: T): LowerEqualThanDescription<T> {
  return {
    lowerEqualThan: {
      left,
      right,
    },
  };
}
