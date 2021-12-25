import { RelationalUpdateResult } from './relational-update-result';
import { AuthorizableClient, Client } from './client';
import { RelationalDeleteResult } from './relational-delete-result';
import { RelationalInsertResult } from './relational-insert-result';
import { isAllDescription } from '../sql/keyword/all/all-description';
import { UpdateSql } from '../sql/dml/update/update-sql';
import { RelationalRawResult } from '../adapter/relational-raw-result';
import { InsertSql } from '../sql/dml/insert/insert-sql';
import { DeleteSql } from '../sql/dml/delete/delete-sql';
import { isSingleFieldSelect, SelectSql } from '../sql/dml/select/select-sql';
import { deepClone } from '@daita/common';
import { RelationalDataAdapter } from '../adapter/relational-data-adapter';
import { Rule } from '../permission';
import { SqlClient } from './sql-client';
import { RelationalAuthorizableClient } from './relational-authorizable-client';

export class RelationalClient implements SqlClient, Client<any> {
  constructor(public dataAdapter: RelationalDataAdapter<any>) {}

  async selectFirst<T>(sql: SelectSql<T>): Promise<T | null> {
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

  authorizable(rules: { id: string; rule: Rule }[]): AuthorizableClient<any> {
    return new RelationalAuthorizableClient(this.dataAdapter, rules);
  }
}
