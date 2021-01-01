import { RelationalUpdateResult } from './relational-update-result';
import { SelectClient } from './select-client';
import { Client } from './client';
import { UpdateClient } from './update-client';
import { RelationalDeleteResult } from './relational-delete-result';
import { RelationalInsertResult } from './relational-insert-result';
import { DeleteClient } from './delete-client';
import { InsertClient } from './insert-client';
import { isAllDescription } from '../sql/keyword/all/all-description';
import { UpdateSql } from '../sql/dml/update/update-sql';
import { isMaxDescription } from '../sql/function/aggregation/max/max-description';
import { isAvgDescription } from '../sql/function/aggregation/avg/avg-description';
import { isSumDescription } from '../sql/function/aggregation/sum/sum-description';
import { isCountDescription } from '../sql/function/aggregation/count/count-description';
import { isNowDescription } from '../sql/function/date/now/now-description';
import { RelationalRawResult } from '../adapter/relational-raw-result';
import { isConcatDescription } from '../sql/function/string/concat/concat-description';
import { InsertSql } from '../sql/dml/insert/insert-sql';
import { DeleteSql } from '../sql/dml/delete/delete-sql';
import { isSingleFieldSelect, SelectSql } from '../sql/dml/select/select-sql';
import { deepClone } from '../../common/utils/deep-clone';
import { isMinDescription } from '../sql/function/aggregation/min/min-description';
import { isFieldDescription } from '../sql/keyword/field/field-description';
import { RelationalDataAdapter } from '../adapter/relational-data-adapter';
import { isAddDescription } from '../sql/operands/arithmetic/add/add-description';
import { isSubtractDescription } from '../sql/operands/arithmetic/substract/subtract-description';
import { isMultiplyDescription } from '../sql/operands/arithmetic/multiply/multiply-description';
import { isDivideDescription } from '../sql/operands/arithmetic/divide/divide-description';
import { isLeastDescription } from '../sql/function/conditional/least/least-description';
import { isGreatestDescription } from '../sql/function/conditional/greatest/greatest-description';

export class RelationalClient implements SelectClient, UpdateClient, DeleteClient, InsertClient, Client<any> {
  constructor(public dataAdapter: RelationalDataAdapter<any>) {}

  close() {
    return this.dataAdapter.close();
  }

  async selectFirst<T>(sql: SelectSql<T>): Promise<T> {
    const clonedSql = deepClone(sql);
    clonedSql.limit = 1;
    const result = await this.dataAdapter.exec(clonedSql);
    const row = this.mapResult(sql, result.rows)[0];
    return row ?? null;
  }

  async select<T>(sql: SelectSql<T>): Promise<T[]> {
    const result = await this.exec(sql);
    return this.mapResult(sql, result.rows);
  }

  async update<T>(sql: UpdateSql<T>): Promise<RelationalUpdateResult> {
    const result = await this.exec(sql);
    return { updatedRows: result.rowCount };
  }

  async delete(sql: DeleteSql): Promise<RelationalDeleteResult> {
    const result = await this.exec(sql);
    return { deletedRows: result.rowCount };
  }

  async insert<T>(sql: InsertSql<T>): Promise<RelationalInsertResult> {
    const result = await this.exec(sql);
    return { insertedRows: result.rowCount };
  }

  exec(sql: any): Promise<RelationalRawResult> {
    return this.dataAdapter.exec(sql);
  }

  private mapResult(sql: SelectSql<any>, rows: any[]): any[] {
    if (rows.length === 0) {
      return rows;
    }

    const fields = sql.select;
    if (typeof fields === 'object') {
      if (isSingleFieldSelect(fields)) {
        return rows.map((row) => row[Object.keys(row)[0]]);
      }

      if (isAllDescription(fields)) {
        return rows;
      }

      const mappedRows: any[] = [];
      for (const row of rows) {
        const mappedRow: any = {};
        for (const key of Object.keys(row)) {
          const parts = key.split('.');
          if (parts.length === 1) {
            mappedRow[key] = row[key];
          } else {
            let value = mappedRow;
            for (let i = 0; i < parts.length - 1; i++) {
              if (!value[parts[i]]) {
                value[parts[i]] = {};
              }
              value = value[parts[i]];
            }
            value[parts[parts.length - 1]] = row[key];
          }
        }
        mappedRows.push(mappedRow);
      }
      return mappedRows;
    } else {
      return rows.map((row) => row[Object.keys(row)[0]]);
    }
  }

  supportsQuery(sql: any): boolean {
    return this.dataAdapter.supportsQuery(sql);
  }

  toString() {
    return this.dataAdapter.toString();
  }
}
