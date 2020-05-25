import { SqlTable } from "../../sql-table";
import { SqlAlterTableDropConstraint } from "./alter-table-drop-constraint-query";
import { SqlAlterTableDropColumn } from "./alter-table-drop-column-query";
import { isKind } from "@daita/common";

export interface SqlAlterTableDrop {
  alterTable: SqlTable;
  drop: SqlAlterTableDropColumn | SqlAlterTableDropConstraint;
}

export const isSqlAlterTableDrop = (val: any): val is SqlAlterTableDrop =>
  isKind<SqlAlterTableDrop>(val, ["alterTable", "drop"]);
