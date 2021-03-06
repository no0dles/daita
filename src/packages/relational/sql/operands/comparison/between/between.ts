import { BetweenDescription } from './between-description';

export function between<T extends number | Date>(value: T, min: T, max: T): BetweenDescription<T> {
  return { between: { value, min, max } };
}
