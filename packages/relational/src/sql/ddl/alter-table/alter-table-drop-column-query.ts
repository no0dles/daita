import { isKind } from "@daita/common";

export interface SqlAlterTableDropColumn {
  column: string;
}

export const isSqlAlterDropColumn = (val: any): val is SqlAlterTableDropColumn =>
  isKind<SqlAlterTableDropColumn>(val, ["column"]);
