import { RelationalDataAdapter } from '../adapter';
import { RelationalSubQueryWhereBuilder } from './relational-sub-query-where-builder';
import { SqlDelete, SqlDeleteResult } from '../sql/dml/delete';
import { SqlSchemaTable } from '../sql';
import { RootFilter } from '../query';

export class RelationalDeleteBuilder<T> extends RelationalSubQueryWhereBuilder<
  T,
  SqlDelete,
  SqlDeleteResult
> {
  constructor(dataAdapter: RelationalDataAdapter, query: SqlDelete) {
    super(dataAdapter, query);
  }

  protected async execute(): Promise<SqlDeleteResult> {
    const result = await this.dataAdapter.exec(this.query);
    return { affectedRows: result.rowCount };
  }

  protected getSourceTable(): SqlSchemaTable | null {
    return null;
  }

  where(filter: RootFilter<T>): RelationalDeleteBuilder<T> {
    return new RelationalDeleteBuilder<T>(
      this.dataAdapter,
      this.addWhereFilter(filter),
    );
  }
}
