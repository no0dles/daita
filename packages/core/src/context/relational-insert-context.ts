import { RelationalTransactionDataAdapter } from '../adapter';
import { MigrationSchema } from '../schema/migration-schema';
import { ExcludeNonPrimitive } from './types/exclude-non-primitive';
import {TableInformation} from './table-information';

export class RelationalInsertContext<T> {
  constructor(
    private dataAdapter: RelationalTransactionDataAdapter,
    private schema: MigrationSchema,
    private type: TableInformation<T>,
    private rows: any[]
  ) {}

  value(item: ExcludeNonPrimitive<T>): RelationalInsertContext<T> {
    const table = this.schema.table(this.type.name);
    if (!table) {
      throw new Error(`Could not find table ${this.type.name} in schema`);
    }

    return new RelationalInsertContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      [...this.rows, item],
    );
  }

  values(...items: ExcludeNonPrimitive<T>[]): RelationalInsertContext<T> {
    const table = this.schema.table(this.type.name);
    if (!table) {
      throw new Error(`Could not find table ${this.type.name} in schema`);
    }

    return new RelationalInsertContext<T>(
      this.dataAdapter,
      this.schema,
      this.type,
      [...this.rows, ...items],
    );
  }

  async exec(): Promise<void> {
    await this.dataAdapter.insert(this.schema, this.type.name, this.rows);
  }
}
