import { DefaultConstructable } from './constructable';
import { SqlTable } from '../sql';

export type TableInformation<T> = DefaultConstructable<T> | SqlTable;
