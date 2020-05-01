import { RelationalDataAdapter } from "../adapter";
import { RelationalQueryBuilder } from "./relational-query-builder";
import { SqlInsert, SqlInsertResult } from "../sql/insert";
import { isSqlSelect } from "../sql/select/sql-select";
import { deepClone, ExcludeNonPrimitive } from "@daita/common";

export class RelationalInsertBuilder<T> extends RelationalQueryBuilder<SqlInsert,
  SqlInsertResult> {
  constructor(dataAdapter: RelationalDataAdapter, insert: SqlInsert) {
    super(dataAdapter, insert);
  }

  value(item: ExcludeNonPrimitive<T>): RelationalInsertBuilder<T> {
    const clone = deepClone(this.query);
    this.addValue(clone, item);
    return new RelationalInsertBuilder<T>(this.dataAdapter, clone);
  }

  values(...items: ExcludeNonPrimitive<T>[]): RelationalInsertBuilder<T> {
    const clone = deepClone(this.query);
    for (const item of items) {
      this.addValue(clone, item);
    }
    return new RelationalInsertBuilder<T>(this.dataAdapter, clone);
  }

  private addValue(query: SqlInsert, item: ExcludeNonPrimitive<T>) {
    if (query.values instanceof Array) {
      query.values.push(item);
    } else if (isSqlSelect(query.values)) {
      throw new Error("can use select and values combined");
    }
  }

  protected async execute(): Promise<SqlInsertResult> {
    const result = await this.dataAdapter.exec(this.query);
    return { affectedRows: result.rowCount };
  }
}
