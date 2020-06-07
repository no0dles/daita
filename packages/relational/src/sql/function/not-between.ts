import { NotBetweenDescription } from '../description/not-between';

export function notBetween<T extends number | Date>(value: T, min: T, max: T): NotBetweenDescription<any> {
  return {
    notBetween: { value, min, max },
  };
}
