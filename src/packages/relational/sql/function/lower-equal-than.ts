import { LowerEqualThanDescription } from '../description';

export function lowerEqualThan<T extends number | Date>(left: T, right: T): LowerEqualThanDescription<T> {
  return {
    lowerEqualThan: {
      left,
      right,
    },
  };
}
