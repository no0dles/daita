import { SqlTable } from "../../sql-table";
import { SqlAlterTableAddColumn } from "./alter-table-add-column-query";
import { SqlAlterTableAddForeignKey } from "./alter-table-add-foreign-key-query";
import { isKind } from "@daita/common";

export interface SqlAlterTableAdd<TFieldType> {
  alterTable: SqlTable;
  add:
    | SqlAlterTableAddColumn<TFieldType>
    | SqlAlterTableAddForeignKey<string>
    | SqlAlterTableAddForeignKey<string[]>;
}

export const isSqlAlterTableAdd = (val: any): val is SqlAlterTableAdd<any> =>
  isKind<SqlAlterTableAdd<any>>(val, ["alterTable", "add"]);
