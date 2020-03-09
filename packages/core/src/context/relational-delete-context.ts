import {RelationalDataAdapter} from '../adapter';
import {RootFilter} from '../query/root-filter';
import {MigrationSchema} from '../schema/migration-schema';
import {TableInformation} from './table-information';
import {ContextUser} from '../auth';

export class RelationalDeleteContext<T> implements PromiseLike<{ affectedRows: number }> {
  constructor(
    private dataAdapter: RelationalDataAdapter,
    private schema: MigrationSchema,
    private type: TableInformation<T>,
    private filter: RootFilter<T> | null,
    private user: ContextUser | null,
  ) {
  }

  where(data: RootFilter<T>): RelationalDeleteContext<T> {
    if (this.filter) {
      return new RelationalDeleteContext<T>(
        this.dataAdapter,
        this.schema,
        this.type,
        {
          $and: [this.filter, data],
        },
        this.user,
      );
    }

    return new RelationalDeleteContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      data,
      this.user,
    );
  }

  then<TResult1 = { affectedRows: number }, TResult2 = never>(onfulfilled?: ((value: { affectedRows: number }) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): PromiseLike<TResult1 | TResult2> {
    return this.dataAdapter
      .delete(
        this.schema,
        this.type.name,
        this.filter,
      )
      .then(onfulfilled)
      .catch(onrejected);
  }
}
