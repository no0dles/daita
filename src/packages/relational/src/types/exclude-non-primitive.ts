import { PickByValue } from '@daita/common/dist/types/pick-by-value';
import { Json } from './json';

export type ExcludeNonPrimitive<T> = PickByValue<T, number | boolean | Date | string | Json<any> | null | undefined>;
