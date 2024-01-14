import { PickByValue } from '@daita/common';
import { Json } from './json';

export type ExcludeNonPrimitive<T> = PickByValue<T, number | boolean | Date | string | Json<any> | null | undefined>;
