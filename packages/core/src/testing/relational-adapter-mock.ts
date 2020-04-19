import { SqlDelete, SqlInsert, SqlQuery, SqlSelect, SqlUpdate } from '../sql';
import {
  isRelationalRawResult,
  RelationalDataAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
} from '../adapter';

export class RelationalAdapterMock implements RelationalTransactionAdapter {
  private mockResult: RelationalRawResult | null = null;
  private expected: { sql: string | SqlQuery; values?: any[] } | null = null;

  raw(sql: string, values: any[]): Promise<RelationalRawResult>;
  raw(
    sql: SqlSelect | SqlDelete | SqlUpdate | SqlInsert,
  ): Promise<RelationalRawResult>;
  raw(sql: string | SqlQuery, values?: any[]): Promise<RelationalRawResult> {
    if (this.expected) {
      expect(sql).toEqual(this.expected.sql);
      expect(values).toEqual(this.expected.values);
    }
    if (this.mockResult) {
      return Promise.resolve(this.mockResult);
    }
    throw new Error('no result defined');
  }

  transaction<T>(
    action: (adapter: RelationalDataAdapter) => Promise<T>,
  ): Promise<T> {
    return action(new RelationalAdapterMock());
  }

  expect(sql: string, values: any[], result?: RelationalRawResult): void;
  expect(sql: SqlQuery, result?: RelationalRawResult): void;
  expect(result: RelationalRawResult): void;
  expect(
    sqlOrResult: string | SqlQuery | RelationalRawResult,
    valuesOrResult?: any[] | RelationalRawResult,
    result?: RelationalRawResult,
  ): void {
    if (typeof sqlOrResult === 'string') {
      if (valuesOrResult instanceof Array) {
        this.expected = { sql: sqlOrResult, values: valuesOrResult };
        this.mockResult = result || { rowCount: 0, rows: [] };
      } else {
        throw new Error('invalid values defined');
      }
    } else if (isRelationalRawResult(sqlOrResult)) {
      this.mockResult = sqlOrResult;
    } else {
      this.expected = { sql: sqlOrResult };
      if (isRelationalRawResult(valuesOrResult)) {
        this.mockResult = valuesOrResult;
      } else {
        this.mockResult = { rowCount: 0, rows: [] };
      }
    }
  }
}
