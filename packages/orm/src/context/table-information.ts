import { SqlTable } from "@daita/relational";
import { DefaultConstructable } from "@daita/common";

export type TableInformation<T> = DefaultConstructable<T> | SqlTable;
