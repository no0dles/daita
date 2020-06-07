import { LikeDescription } from '../description/like';

export function like<T extends string>(field: T, value: T): LikeDescription<T> {
  return {
    like: {
      left: field,
      right: value,
    },
  };
}
