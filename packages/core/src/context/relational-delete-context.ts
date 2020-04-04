import {RootFilter} from '../query/root-filter';
import {TableInformation} from './table-information';
import {RelationalSchemaBaseContext} from './relational-schema-base-context';
import {RelationalDeleteBuilder} from '../builder/relational-delete-builder';
import {SqlDeleteResult} from '../sql/delete';
import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';

export class RelationalDeleteContext<T> extends RelationalSchemaBaseContext<SqlDeleteResult> {
  constructor(
    private schema: RelationalSchemaDescription,
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
