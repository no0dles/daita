import {RelationalDataAdapter} from '../adapter/relational-data-adapter';
import {MigrationSchema} from '../schema/migration-schema';
import {RelationalInsertContext} from './relational-insert-context';
import {DefaultConstructable} from '../constructable';
import {RelationalSelectContext} from './relational-select-context';
import {RelationalUpdateContext} from './relational-update-context';
import {RelationalDeleteContext} from './relational-delete-context';
import {RelationalDataContext} from './relational-data-context';
import {RelationalUpdateBuilder} from '../builder/relational-update-builder';
import {RelationalInsertBuilder} from '../builder/relational-insert-builder';
import {RelationalDeleteBuilder} from '../builder/relational-delete-builder';
import {getSqlTable} from '../builder/utils';
import {RelationalSelectBuilder} from '../builder/relational-select-builder';

export class RelationalSchemaContext implements RelationalDataContext {
  constructor(protected relationalDataAdapter: RelationalDataAdapter,
              protected schema: MigrationSchema) {
  }

  insert<T>(type: DefaultConstructable<T>): RelationalInsertContext<T> {
    return new RelationalInsertContext<T>(
      this.schema,
      type,
      new RelationalInsertBuilder(this.relationalDataAdapter, getSqlTable(type)),
    );
  }

  select<T>(type: DefaultConstructable<T>): RelationalSelectContext<T> {
    return new RelationalSelectContext<T>(
      this.schema,
      type,
      new RelationalSelectBuilder(this.relationalDataAdapter, getSqlTable(type)),
    );
  }

  update<T>(type: DefaultConstructable<T>): RelationalUpdateContext<T> {
    return new RelationalUpdateContext<T>(
      this.schema,
      type,
      new RelationalUpdateBuilder<T>(this.relationalDataAdapter, getSqlTable(type)),
    );
  }

  delete<T>(type: DefaultConstructable<T>): RelationalDeleteContext<T> {
    return new RelationalDeleteContext<T>(
      this.schema,
      type,
      new RelationalDeleteBuilder<T>(this.relationalDataAdapter, getSqlTable(type)),
    );
  }
}
