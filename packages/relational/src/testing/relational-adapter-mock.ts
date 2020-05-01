import { SqlDelete, SqlInsert, SqlQuery, SqlSelect, SqlUpdate } from "../sql";
import {
  isRelationalRawResult,
  RelationalDataAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter
} from "../adapter";

export class RelationalAdapterMock implements RelationalTransactionAdapter {
  private mockResult: RelationalRawResult | null = null;
  private expected: { sql: string | SqlQuery; values?: any[] } | null = null;

  execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    if (this.expected) {
      expect(sql).toEqual(this.expected.sql);
      expect(values).toEqual(this.expected.values);
    }
    if (this.mockResult) {
      return Promise.resolve(this.mockResult);
    }
    throw new Error("no result defined");
  }

  exec(
    sql: SqlQuery
  ): Promise<RelationalRawResult> {
    if (this.expected) {
      expect(sql).toEqual(this.expected.sql);
    }
    if (this.mockResult) {
      return Promise.resolve(this.mockResult);
    }
    throw new Error("no result defined");
  }

  transaction<T>(
    action: (adapter: RelationalDataAdapter) => Promise<T>
  ): Promise<T> {
    return action(new RelationalAdapterMock());
  }

  expectRaw(sql: string, values: any[], result?: RelationalRawResult): void
  expectRaw(result: RelationalRawResult): void
  expectRaw(sqlOrResult: string | RelationalRawResult, values?: any[], result?: RelationalRawResult): void {
    if (typeof sqlOrResult === "string") {
      this.expected = { sql: sqlOrResult, values };
      if (result) {
        this.mockResult = result;
      }
    } else {
      this.mockResult = sqlOrResult;
    }
  }

  expect(sql: SqlQuery, result?: RelationalRawResult): void;
  expect(result: RelationalRawResult): void;
  expect(
    sqlOrResult: SqlQuery | RelationalRawResult,
    result?: RelationalRawResult
  ): void {
    if (isRelationalRawResult(sqlOrResult)) {
      this.mockResult = sqlOrResult;
    } else {
      this.expected = { sql: sqlOrResult };
      if (result) {
        this.mockResult = result;
      }
    }
  }

  async close() {
    this.mockResult = null;
    this.expected = null;
  }
}
