import {
  DeleteSql, InsertSql,
  isFieldDescription,
  SelectSql,
  UpdateSql,
} from '../sql';
import { RelationalDataAdapter, RelationalRawResult } from '../adapter';
import { deepClone } from '@daita/common';
import { RelationalUpdateResult } from './relational-update-result';
import { SelectClient } from './select-client';
import { Client } from './client';
import { UpdateClient } from './update-client';
import { RelationalDeleteResult } from './relational-delete-result';
import { RelationalInsertResult } from './relational-insert-result';
import { DeleteClient } from './delete-client';
import { InsertClient } from './insert-client';
import { isAllDescription } from '../sql/description/all';


export class RelationalClient implements SelectClient, UpdateClient, DeleteClient, InsertClient, Client<any> {
  constructor(private dataAdapter: RelationalDataAdapter<any>) {
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

  async update(sql: UpdateSql<any>): Promise<RelationalUpdateResult> {
    const result = await this.exec(sql);
    return { updatedRows: result.rowCount };
  }

  async delete(sql: DeleteSql): Promise<RelationalDeleteResult> {
    const result = await this.exec(sql);
    return { deletedRows: result.rowCount };
  }

  async insert(sql: InsertSql<any>): Promise<RelationalInsertResult> {
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
      if (isFieldDescription(fields)) {
        return rows.map(row => row[fields.field.key]);
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
      return rows.map(row => row[Object.keys(row)[0]]);
    }
  }
}
