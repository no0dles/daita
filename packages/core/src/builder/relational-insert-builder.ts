import {RelationalDataAdapter} from '../adapter';
import {SqlTable} from '../sql/sql-table';
import {ExcludeNonPrimitive} from '../context/types/exclude-non-primitive';
import {RelationalQueryBuilder} from './relational-query-builder';
import {deepClone} from './utils';
import {SqlInsert, SqlInsertResult} from '../sql/insert';
import {isSqlSelect} from '../sql/select/sql-select';

export class RelationalInsertBuilder<T> extends RelationalQueryBuilder<SqlInsert, SqlInsertResult> {
  constructor(dataAdapter: RelationalDataAdapter, table: SqlTable) {
    super(dataAdapter, {insert: table, values: []});
  }

  value(item: ExcludeNonPrimitive<T>): RelationalInsertBuilder<T> {
    const clone = deepClone(this);
    this.addValue(clone, item);
    return clone;
  }

  values(...items: ExcludeNonPrimitive<T>[]): RelationalInsertBuilder<T> {
    const clone = deepClone(this);
    for (const item of items) {
      this.addValue(clone, item);
    }
    return this;
  }

  private addValue(clone: RelationalInsertBuilder<T>, item: ExcludeNonPrimitive<T>) {
    if (clone.query.values instanceof Array) {
      clone.query.values.push(item);
    } else if (isSqlSelect(clone.query.values)) {
      throw new Error('can use select and values combined');
    }
  }

  protected async execute(): Promise<SqlInsertResult> {
    const result = await this.dataAdapter.raw(this.query);
    return {affectedRows: result.rowCount};
  }
}
