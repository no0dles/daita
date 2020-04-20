import { DefaultConstructable, SqlTable } from "@daita/core";

export type TableInformation<T> = DefaultConstructable<T> | SqlTable;
