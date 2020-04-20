import {RelationalInsertContext} from './relational-insert-context';
import {RelationalSelectContext} from './relational-select-context';
import {RelationalUpdateContext} from './relational-update-context';
import {RelationalDeleteContext} from './relational-delete-context';
import {RelationalDataContext} from './relational-data-context';
import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';
import {
  RelationalDataAdapter, RelationalDeleteBuilder,
  RelationalInsertBuilder,
  RelationalSelectBuilder, RelationalUpdateBuilder
} from "@daita/relational";
import { DefaultConstructable } from "@daita/common";

export class RelationalSchemaContext implements RelationalDataContext {
  constructor(protected relationalDataAdapter: RelationalDataAdapter,
              protected schema: RelationalSchemaDescription) {
  }

  insert<T>(type: DefaultConstructable<T>): RelationalInsertContext<T> {
    const table = this.schema.table(type);
    return new RelationalInsertContext<T>(
      this.schema,
      type,
      new RelationalInsertBuilder(this.relationalDataAdapter, table.getSqlInsert()),
    );
  }

  select<T>(type: DefaultConstructable<T>): RelationalSelectContext<T> {
    const table = this.schema.table(type);
    return new RelationalSelectContext<T>(
      this.schema,
      type,
      new RelationalSelectBuilder<T>(this.relationalDataAdapter, table.getSqlSelect()),
    );
  }

  update<T>(type: DefaultConstructable<T>): RelationalUpdateContext<T> {
    const table = this.schema.table(type);
    return new RelationalUpdateContext<T>(
      this.schema,
      type,
      new RelationalUpdateBuilder<T>(this.relationalDataAdapter, table.getSqlUpdate()),
    );
  }

  delete<T>(type: DefaultConstructable<T>): RelationalDeleteContext<T> {
    const table = this.schema.table(type);
    return new RelationalDeleteContext<T>(
      this.schema,
      type,
      new RelationalDeleteBuilder<T>(this.relationalDataAdapter, table.getSqlDelete()),
    );
  }
}
