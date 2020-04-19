import { RelationalDataAdapter } from '../adapter';
import { SqlTable } from '../sql/sql-table';
import { PrimitivePartial } from '../context/types/primitive-partial';
import { deepClone } from './utils';
import { RelationalSubQueryWhereBuilder } from './relational-sub-query-where-builder';
import { isSqlUpdateSet } from '../sql/update/sql-update-set';
import { SqlUpdate, SqlUpdateResult } from '../sql/update';
import { SqlSchemaTable } from '../sql';
import { RootFilter } from '../query';

export class RelationalUpdateBuilder<T> extends RelationalSubQueryWhereBuilder<
  T,
  SqlUpdate,
  SqlUpdateResult
> {
  constructor(dataAdapter: RelationalDataAdapter, update: SqlUpdate) {
    super(dataAdapter, update);
  }

  set(data: PrimitivePartial<T>): RelationalUpdateBuilder<T> {
    const clone = deepClone(this.query);
    for (const key of Object.keys(data)) {
      const value = (data as any)[key];
      if (!isSqlUpdateSet(value)) {
        throw new Error(`unable to set ${value}`);
      }
      clone.set[key] = value;
    }
    return new RelationalUpdateBuilder<T>(this.dataAdapter, clone);
  }

  where(filter: RootFilter<T>): RelationalUpdateBuilder<T> {
    return new RelationalUpdateBuilder<T>(
      this.dataAdapter,
      this.addWhereFilter(filter),
    );
  }

  protected async execute(): Promise<SqlUpdateResult> {
    const result = await this.dataAdapter.raw(this.query);
    return { affectedRows: result.rowCount };
  }

  protected getSourceTable(): SqlSchemaTable | null {
    return null;
  }
}
