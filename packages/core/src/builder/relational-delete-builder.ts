import {RelationalDataAdapter} from '../adapter';
import {SqlTable} from '../sql/sql-table';
import {RelationalSubQueryWhereBuilder} from './relational-sub-query-where-builder';
import {SqlDelete, SqlDeleteResult} from '../sql/delete';
import {SqlSchemaTable} from '../sql';

export class RelationalDeleteBuilder<T> extends RelationalSubQueryWhereBuilder<T, SqlDelete, SqlDeleteResult> {
  constructor(dataAdapter: RelationalDataAdapter, table: SqlTable) {
    super(dataAdapter, {delete: table});
  }

  protected async execute(): Promise<SqlDeleteResult> {
    const result = await this.dataAdapter.raw(this.query);
    return {affectedRows: result.rowCount};
  }

  protected getSourceTable(): SqlSchemaTable | null {
    return null;
  }
}
