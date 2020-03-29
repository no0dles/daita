import {RootFilter} from '../query/root-filter';
import {MigrationSchema} from '../schema/migration-schema';
import {TableInformation} from './table-information';
import {RelationalSchemaBaseContext} from './relational-schema-base-context';
import {RelationalDeleteBuilder} from '../builder/relational-delete-builder';
import {SqlDeleteResult} from '../sql/delete';

export class RelationalDeleteContext<T> extends RelationalSchemaBaseContext<SqlDeleteResult> {
  constructor(
    private schema: MigrationSchema,
    private type: TableInformation<T>,
    private builder: RelationalDeleteBuilder<T>
  ) {
    super(builder);
  }

  where(data: RootFilter<T>): RelationalDeleteContext<T> {
    const newBuilder = this.builder.where(data);
    return new RelationalDeleteContext<T>(this.schema, this.type, newBuilder);
  }
}
