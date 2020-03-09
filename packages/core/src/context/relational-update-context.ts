import {RelationalDataAdapter} from '../adapter';
import {RootFilter} from '../query/root-filter';
import {MigrationSchema} from '../schema/migration-schema';
import {PrimitivePartial} from './types/primitive-partial';
import {TableInformation} from './table-information';
import {ContextUser} from '../auth';

export class RelationalUpdateContext<T> implements PromiseLike<{ affectedRows: number }> {
  constructor(
    private dataAdapter: RelationalDataAdapter,
    private schema: MigrationSchema,
    private type: TableInformation<T>,
    private data: PrimitivePartial<T>,
    private filter: RootFilter<T> | null,
    private user: ContextUser | null,
  ) {
  }

  set(data: PrimitivePartial<T>): RelationalUpdateContext<T> {
    return new RelationalUpdateContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      {...this.data, ...data},
      this.filter,
      this.user,
    );
  }

  where(filter: RootFilter<T>): RelationalUpdateContext<T> {
    if (this.filter) {
      return new RelationalUpdateContext<T>(
        this.dataAdapter,
        this.schema,
        this.type,
        this.data,
        {
          $and: [this.filter, filter],
        },
        this.user,
      );
    }

    return new RelationalUpdateContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      this.data,
      filter,
      this.user,
    );
  }

  then<TResult1 = { affectedRows: number }, TResult2 = never>(onfulfilled?: ((value: { affectedRows: number }) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): PromiseLike<TResult1 | TResult2> {
    return this.dataAdapter
      .update(
        this.schema,
        this.type.name,
        this.data,
        this.filter,
      )
      .then(onfulfilled)
      .catch(onrejected);
  }
}
