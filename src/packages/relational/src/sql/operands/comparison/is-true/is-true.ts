import { IsTrueDescription } from './is-true-description';

export function isTrue(field: boolean): IsTrueDescription {
  return {
    isTrue: { field },
  };
}
