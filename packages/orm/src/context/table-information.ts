import { DefaultConstructable } from '../constructable';
import {SqlTable} from '../sql/sql-table';

export type TableInformation<T> = DefaultConstructable<T> | SqlTable;
