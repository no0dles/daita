import { IsFalseDescription } from './is-false-description';

export function isFalse(field: boolean): IsFalseDescription {
  return {
    isFalse: { field },
  };
}
