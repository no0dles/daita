import {RelationalDataAdapter, RelationalTransactionAdapter} from '../adapter';
import { RootFilter } from '../query/root-filter';
import { MigrationSchema } from '../schema/migration-schema';
import { TableInformation } from './table-information';
import {ContextUser} from '../auth';

export class RelationalDeleteContext<T> {
  constructor(
    private dataAdapter: RelationalDataAdapter,
    private schema: MigrationSchema,
    private type: TableInformation<T>,
    private filter: RootFilter<T> | null,
    private user: ContextUser | null,
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

  async exec(): Promise<{ affectedRows: number }> {
    const result = await this.dataAdapter.delete(
      this.schema,
      this.type.name,
      this.filter,
    );
    return result;
  }
}
