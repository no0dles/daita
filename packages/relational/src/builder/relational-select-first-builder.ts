import { RelationalQueryBuilder } from './relational-query-builder';
import { RelationalDataAdapter } from '../adapter';
import { SqlSelect } from '../sql/select';
import { deepClone } from '@daita/common';

export class RelationalSelectFirstBuilder<T> extends RelationalQueryBuilder<
  SqlSelect,
  T
> {
  constructor(dataAdapter: RelationalDataAdapter, query: SqlSelect) {
    super(dataAdapter, query);
  }

  protected async execute(): Promise<T> {
    const query = deepClone(this.query);
    query.limit = 1;
    const result = await this.dataAdapter.exec(query);
    if (result.rows.length === 1) {
      return result.rows[0];
    }

    throw new Error('no record found');
  }
}
