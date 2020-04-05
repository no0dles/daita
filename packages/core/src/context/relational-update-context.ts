import {RootFilter} from '../query/root-filter';
import {PrimitivePartial} from './types/primitive-partial';
import {TableInformation} from './table-information';
import {RelationalSchemaBaseContext} from './relational-schema-base-context';
import {RelationalUpdateBuilder} from '../builder/relational-update-builder';
import {SqlUpdateResult} from '../sql/update';
import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';

export class RelationalUpdateContext<T> extends RelationalSchemaBaseContext<SqlUpdateResult> {
  constructor(
    schema: RelationalSchemaDescription,
    type: TableInformation<T>,
    private builder: RelationalUpdateBuilder<T>,
  ) {
    super(builder, type, schema);
  }

  set(data: PrimitivePartial<T>): RelationalUpdateContext<T> {
    const newBuilder = this.builder.set(data);
    //TODO validate
    return new RelationalUpdateContext<T>(this.schema, this.type, newBuilder);
  }

  where(filter: RootFilter<T>): RelationalUpdateContext<T> {
    const newBuilder = this.builder.where(filter);
    const query = this.getBuilderQuery(newBuilder);
    if (query.where) {
      this.mapExpressionFields(query.where);
    }
    return new RelationalUpdateContext<T>(this.schema, this.type, newBuilder);
  }
}
