import { DefaultConstructable } from '@daita/common';
import { SqlTable } from '../sql';

export type TableInformation<T> = DefaultConstructable<T> | SqlTable;
