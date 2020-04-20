import {TableInformation} from './table-information';
import {RelationalSchemaBaseContext} from './relational-schema-base-context';
import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';
import { RelationalDeleteBuilder, RootFilter, SqlDeleteResult } from "@daita/core";

export class RelationalDeleteContext<T> extends RelationalSchemaBaseContext<RelationalDeleteBuilder<T>, SqlDeleteResult> {
  constructor(
    schema: RelationalSchemaDescription,
    type: TableInformation<T>,
    builder: RelationalDeleteBuilder<T>
  ) {
    super(builder, type, schema);
  }

  where(data: RootFilter<T>): RelationalDeleteContext<T> {
    const newBuilder = this.builder.where(data);
    const query = this.getBuilderQuery(newBuilder);
    if (query.where) {
      this.mapExpressionFields(query.where);
    }
    return new RelationalDeleteContext<T>(this.schema, this.type, newBuilder);
  }

  toSql() {
    return this.builder.toSql();
  }
}
