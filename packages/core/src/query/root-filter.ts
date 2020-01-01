import {AndRootFilter} from './and-root-filter';
import {OrRootFilter} from './or-root-filter';
import {QueryFilter} from './query-filter';

export type RootFilter<T> = OrRootFilter<T> | AndRootFilter<T> | QueryFilter<T>;
