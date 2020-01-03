import { DefaultConstructable } from '../constructable';

export type TableInformation<T> = DefaultConstructable<T> | { name: string };
