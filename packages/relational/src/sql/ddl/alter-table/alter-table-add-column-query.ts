import { isKind } from "@daita/common";

export interface SqlAlterTableAddColumn<TFieldType> {
  column: string;
  type: TFieldType;
}

export const isSqlAlterAddColumn = (val: any): val is SqlAlterTableAddColumn<any> =>
  isKind<SqlAlterTableAddColumn<any>>(val, ["column", 'type']);
