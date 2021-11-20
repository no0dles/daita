import { NotBetweenDescription } from './not-between-description';

export function notBetween<T extends number | Date>(value: T, min: T, max: T): NotBetweenDescription<any> {
  return {
    notBetween: { value, min, max },
  };
}
