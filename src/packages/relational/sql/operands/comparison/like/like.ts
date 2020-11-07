import { LikeDescription } from './like-description';

export function like<T extends string>(field: T, value: T): LikeDescription<T> {
  return {
    like: {
      left: field,
      right: value,
    },
  };
}
