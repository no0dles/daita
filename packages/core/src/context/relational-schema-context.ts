import {RelationalDataAdapter} from '../adapter/relational-data-adapter';
import {RelationalInsertContext} from './relational-insert-context';
import {DefaultConstructable} from '../constructable';
import {RelationalSelectContext} from './relational-select-context';
import {RelationalUpdateContext} from './relational-update-context';
import {RelationalDeleteContext} from './relational-delete-context';
import {RelationalDataContext} from './relational-data-context';
import {RelationalUpdateBuilder} from '../builder/relational-update-builder';
import {RelationalInsertBuilder} from '../builder/relational-insert-builder';
import {RelationalDeleteBuilder} from '../builder/relational-delete-builder';
import {RelationalSelectBuilder} from '../builder/relational-select-builder';
import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';
import {removeEmptySchema} from '../utils/remove-empty-schema';

export class RelationalSchemaContext implements RelationalDataContext {
  constructor(protected relationalDataAdapter: RelationalDataAdapter,
              protected schema: RelationalSchemaDescription) {
  }

  insert<T>(type: DefaultConstructable<T>): RelationalInsertContext<T> {
    const table = this.schema.table(type);
    return new RelationalInsertContext<T>(
      this.schema,
      type,
      new RelationalInsertBuilder(this.relationalDataAdapter, table.name),
    );
  }

  select<T>(type: DefaultConstructable<T>): RelationalSelectContext<T> {
    const table = this.schema.table(type);
    return new RelationalSelectContext<T>(
      this.schema,
      type,
      new RelationalSelectBuilder<T>(this.relationalDataAdapter, removeEmptySchema({table: table.name, schema: table.schema, alias: 'base'})),
    );
  }

  update<T>(type: DefaultConstructable<T>): RelationalUpdateContext<T> {
    const table = this.schema.table(type);
    return new RelationalUpdateContext<T>(
      this.schema,
      type,
      new RelationalUpdateBuilder<T>(this.relationalDataAdapter, table.name),
    );
  }

  delete<T>(type: DefaultConstructable<T>): RelationalDeleteContext<T> {
    const table = this.schema.table(type);
    return new RelationalDeleteContext<T>(
      this.schema,
      type,
      new RelationalDeleteBuilder<T>(this.relationalDataAdapter, table.name),
    );
  }
}
