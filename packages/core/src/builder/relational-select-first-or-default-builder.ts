import {RelationalDataAdapter} from '../adapter';
import {RelationalQueryBuilder} from './relational-query-builder';
import {SqlSelect} from '../sql/select';

export class RelationalSelectFirstOrDefaultBuilder<T> extends RelationalQueryBuilder<SqlSelect, T | null> {
  constructor(dataAdapter: RelationalDataAdapter, query: SqlSelect) {
    super(dataAdapter, query);
  }

  protected async execute(): Promise<T | null> {
    const result = await this.dataAdapter.raw(this.query);
    if (result.rows.length === 1) {
      //TODO map
    }
    return null;
  }
}
