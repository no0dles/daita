import {RelationalDataAdapter} from '../adapter';
import {SqlTable} from '../sql/sql-table';
import {PrimitivePartial} from '../context/types/primitive-partial';
import {deepClone} from './utils';
import {RelationalSubQueryWhereBuilder} from './relational-sub-query-where-builder';
import {isSqlUpdateSet} from '../sql/update/sql-update-set';
import {SqlUpdate, SqlUpdateResult} from '../sql/update';
import {SqlSchemaTable} from '../sql';

export class RelationalUpdateBuilder<T> extends RelationalSubQueryWhereBuilder<T, SqlUpdate, SqlUpdateResult> {
  constructor(dataAdapter: RelationalDataAdapter, table: SqlTable) {
    super(dataAdapter, {update: table, set: {}});
  }

  set(data: PrimitivePartial<T>): RelationalUpdateBuilder<T> {
    const clone = deepClone(this);
    for (const key of Object.keys(data)) {
      const value = (data as any)[key];
      if (!isSqlUpdateSet(value)) {
        throw new Error(`unable to set ${value}`);
      }
      clone.query.set[key] = value;
    }
    return clone;
  }

  protected async execute(): Promise<SqlUpdateResult> {
    const result = await this.dataAdapter.raw(this.query);
    return {affectedRows: result.rowCount};
  }

  protected getSourceTable(): SqlSchemaTable | null {
    return null;
  }
}
