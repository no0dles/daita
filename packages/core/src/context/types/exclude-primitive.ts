import {OmitByValue} from './omit-by-value';

export type ExcludePrimitive<T> = OmitByValue<T, number | Date | string | boolean | undefined | null>