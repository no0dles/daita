import {RelationalQueryBuilder} from './relational-query-builder';
import {RelationalDataAdapter} from '../adapter';
import {SqlSelect} from '../sql/select';

export class RelationalSelectFirstBuilder<T> extends RelationalQueryBuilder<SqlSelect, T> {
  constructor(dataAdapter: RelationalDataAdapter, query: SqlSelect) {
    super(dataAdapter, query);
  }

  protected async execute(): Promise<T> {
    const result = await this.dataAdapter.raw(this.query);
    if (result.rows.length === 1) {
      //TODO map
    }

    throw new Error('');
  }
}
