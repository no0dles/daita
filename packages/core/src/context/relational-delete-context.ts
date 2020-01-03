import { RelationalTransactionDataAdapter } from '../adapter';
import { RootFilter } from '../query/root-filter';
import { MigrationSchema } from '../schema/migration-schema';
import { TableInformation } from './table-information';

export class RelationalDeleteContext<T> {
  constructor(
    private dataAdapter: RelationalTransactionDataAdapter,
    private schema: MigrationSchema,
    private type: TableInformation<T>,
    private filter: RootFilter<T> | null,
  ) {}

  where(data: RootFilter<T>): RelationalDeleteContext<T> {
    if (this.filter) {
      return new RelationalDeleteContext<T>(
        this.dataAdapter,
        this.schema,
        this.type,
        {
          $and: [this.filter, data],
        },
      );
    }

    return new RelationalDeleteContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      data,
    );
  }

  async exec(): Promise<{ affectedRows: number }> {
    const result = await this.dataAdapter.delete(
      this.schema,
      this.type.name,
      this.filter,
    );
    return result;
  }
}
