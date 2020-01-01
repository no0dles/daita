import {QuerySelector} from './query-selector';

export type QueryFilter<T> = {
  [P in keyof T]?: QuerySelector<T[P]>;
};
