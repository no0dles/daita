import { QueryFilter } from './query-filter';

export type QueryFilterObject<T> = { [P in keyof T]?: QueryFilter<T[P]> };
