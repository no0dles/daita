import { RelationalDataAdapter } from '../adapter';
import { RelationalQueryBuilder } from './relational-query-builder';
import { SqlSelect } from '../sql/select';
import { deepClone } from './utils';

export class RelationalSelectFirstOrDefaultBuilder<
  T
> extends RelationalQueryBuilder<SqlSelect, T | null> {
  constructor(dataAdapter: RelationalDataAdapter, query: SqlSelect) {
    super(dataAdapter, query);
  }

  protected async execute(): Promise<T | null> {
    const query = deepClone(this.query);
    query.limit = 1;
    const result = await this.dataAdapter.raw(query);
    if (result.rows.length === 1) {
      //TODO map
      return result.rows[0];
    }
    return null;
  }
}
