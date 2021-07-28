import { PickByValue } from './pick-by-value';
import { Json } from '../../relational/types/json/json';

export type ExcludeNonPrimitive<T> = PickByValue<T, number | boolean | Date | Json<any> | string | null | undefined>;
