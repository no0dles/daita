import { GreaterThanDescription } from '../description/greater-than';

export function greaterThan<T extends number | Date>(left: T, right: T): GreaterThanDescription<T> {
  return {
    greaterThan: {
      left,
      right,
    },
  };
}
