import { SqlTable } from "../../sql-table";
import { isKind } from "@daita/common";
import { SqlCreateFieldQuery } from "./create-field-query";

export interface SqlCreateTableQuery<TFieldType> {
  createTable: SqlTable;
  ifNotExist?: boolean;
  fields: SqlCreateFieldQuery<TFieldType>[];
}

export const isSqlCreateTable = (val: any): val is SqlCreateTableQuery<any> =>
  isKind<SqlCreateTableQuery<any>>(val, ["createTable", "fields"]);
