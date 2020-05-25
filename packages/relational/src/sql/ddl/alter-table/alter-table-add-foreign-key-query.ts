import { SqlTable } from "../../sql-table";
import { isKind } from "@daita/common";

export interface SqlAlterTableAddForeignKey<T> {
  foreignKey: T;
  constraint?: string;
  references: {
    table: SqlTable;
    primaryKeys: T;
  };
}

export const isSqlAlterAddForeignKey = (val: any): val is SqlAlterTableAddForeignKey<any> =>
  isKind<SqlAlterTableAddForeignKey<any>>(val, ["foreignKey", 'references']);
