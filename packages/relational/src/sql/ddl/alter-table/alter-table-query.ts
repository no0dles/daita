import { SqlFieldType } from "../sql-field-type";
import { isSqlAlterTableAdd, SqlAlterTableAdd } from "./alter-table-add-query";
import { isSqlAlterTableDrop, SqlAlterTableDrop } from "./alter-table-query-drop";

export type SqlAlterTableQuery<TFieldType = SqlFieldType> = SqlAlterTableAdd<TFieldType> | SqlAlterTableDrop;

export const isSqlAlterTable = (val: any): val is SqlAlterTableQuery =>
  isSqlAlterTableAdd(val) || isSqlAlterTableDrop(val);
