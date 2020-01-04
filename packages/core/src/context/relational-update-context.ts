import { RelationalTransactionDataAdapter } from '../adapter';
import { RootFilter } from '../query/root-filter';
import { MigrationSchema } from '../schema/migration-schema';
import { PrimitivePartial } from './types/primitive-partial';
import { TableInformation } from './table-information';

export class RelationalUpdateContext<T> {
  constructor(
    private dataAdapter: RelationalTransactionDataAdapter,
    private schema: MigrationSchema,
    private type: TableInformation<T>,
    private data: PrimitivePartial<T>,
    private filter: RootFilter<T> | null,
  ) {}

  set(data: PrimitivePartial<T>): RelationalUpdateContext<T> {
    return new RelationalUpdateContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      { ...this.data, ...data },
      this.filter,
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
      );
    }

    return new RelationalUpdateContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      this.data,
      filter,
    );
  }

  async exec(): Promise<{ affectedRows: number }> {
    return this.dataAdapter.update(
      this.schema,
      this.type.name,
      this.data,
      this.filter,
    );
  }
}
