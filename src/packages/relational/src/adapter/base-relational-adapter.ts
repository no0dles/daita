import { DeleteSql, InsertSql, SelectSql, UpdateSql } from '../sql';
import { RelationalDeleteResult, RelationalInsertResult, RelationalUpdateResult } from '../client';
import { mapResult } from '../client/map-results';
import { deepClone } from '@daita/common';
import { RelationalRawResult } from './relational-raw-result';

export abstract class BaseRelationalAdapter {
  abstract exec(sql: DeleteSql | SelectSql<any> | UpdateSql<any> | InsertSql<any>): Promise<RelationalRawResult>;

  async delete(sql: DeleteSql): Promise<RelationalDeleteResult> {
    const result = await this.exec(sql);
    return { deletedRows: result.rowCount };
  }

  async insert<T>(sql: InsertSql<T>): Promise<RelationalInsertResult> {
    const result = await this.exec(sql);
    return { insertedRows: result.rowCount };
  }

  async select<T>(sql: SelectSql<T>): Promise<T[]> {
    const result = await this.exec(sql);
    return mapResult(sql, result.rows);
  }

  async selectFirst<T>(sql: SelectSql<T>): Promise<T> {
    const clonedSql = deepClone(sql);
    clonedSql.limit = 1;
    const result = await this.exec(clonedSql);
    const row = mapResult(sql, result.rows)[0];
    return row ?? null;
  }

  async update<T>(sql: UpdateSql<T>): Promise<RelationalUpdateResult> {
    const result = await this.exec(sql);
    return { updatedRows: result.rowCount };
  }
}
