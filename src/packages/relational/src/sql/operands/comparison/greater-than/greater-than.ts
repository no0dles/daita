import { GreaterThanDescription } from './greater-than-description';

export function greaterThan<T extends number | Date>(left: T, right: T): GreaterThanDescription<T> {
  return {
    greaterThan: {
      left,
      right,
    },
  };
}
