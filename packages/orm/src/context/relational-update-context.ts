import {TableInformation} from './table-information';
import {RelationalSchemaBaseContext} from './relational-schema-base-context';
import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';
import { PrimitivePartial, RelationalUpdateBuilder, RootFilter, SqlUpdateResult } from "@daita/core";

export class RelationalUpdateContext<T> extends RelationalSchemaBaseContext<RelationalUpdateBuilder<T>, SqlUpdateResult> {
  constructor(
    schema: RelationalSchemaDescription,
    type: TableInformation<T>,
    builder: RelationalUpdateBuilder<T>,
  ) {
    super(builder, type, schema);
  }

  set(data: PrimitivePartial<T>): RelationalUpdateContext<T> {
    const newBuilder = this.builder.set(this.mapData(data));
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

  private mapData(item: any) {
    const objectKeys = Object.keys(item);
    const object: any = {};

    const tableDescription = this.schema.table(this.type);
    for (const fieldDescription of tableDescription.fields) {
      const index = objectKeys.indexOf(fieldDescription.key);
      if (index >= 0) {
        objectKeys.splice(index, 1);
        object[fieldDescription.name] = item[fieldDescription.key];
        fieldDescription.validateValue(object[fieldDescription.name]);
      }
    }

    for (const key of objectKeys) {
      //throw new Error(`Could not find field ${key} in table ${this.table.name}`);
      //warning
    }

    return object;
  }

  toSql() {
    return this.builder.toSql();
  }
}
