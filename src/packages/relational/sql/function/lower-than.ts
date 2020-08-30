import { LowerThanDescription } from '../description';

export function lowerThan<T extends number | Date>(
  left: T,
  right: T,
): LowerThanDescription<T> {
  return {
    lowerThan: {
      left,
      right,
    },
  };
}
