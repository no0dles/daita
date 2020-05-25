import { SqlTable } from "../../sql-table";
import { isKind } from "@daita/common";

export interface SqlDropTableQuery {
  dropTable: SqlTable;
  ifExist?: boolean;
}

export const isSqlDropTable = (val: any): val is SqlDropTableQuery =>
  isKind<SqlDropTableQuery>(val, ["dropTable"]);
