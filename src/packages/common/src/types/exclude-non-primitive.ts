import { PickByValue } from './pick-by-value';

export type ExcludeNonPrimitive<T> = PickByValue<T, number | boolean | Date | string | null | undefined>;
