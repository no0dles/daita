import { MigrationDescription, MigrationTree } from '../migration';
import {
  SchemaTableOptions,
  SchemaTableRequiredKeyOptions,
} from './schema-table-options';
import { RelationalSchemaOptions } from './relational-schema-options';
import { RelationalSchemaDescription } from './description/relational-schema-description';
import { RelationalMapper } from '../context/relational-mapper';
import {
  RelationalBackwardCompatibleMapper,
  RelationalNormalMapper,
} from '../context/orm-mapper';
import { OrmRelationalSchema } from './orm-relational-schema';
import { Constructable, DefaultConstructable } from '../../common/types';
import { SelectSql } from '../../relational/sql';
import { Rule } from '../../relational/permission/description';

export class RelationalSchema implements OrmRelationalSchema {
  private migrationTree = new MigrationTree();
  private _rules: Rule[] = [];
  private tables: Constructable<any>[] = [];
  private views: { view: Constructable<any>; query: SelectSql<any> }[] = [];
  private seeds: { model: DefaultConstructable<any>; values: any[] }[] = [];

  schema: string | null = null;

  constructor(private options?: RelationalSchemaOptions) {
    if (options && options.schema) {
      this.schema = options.schema;
    }
  }

  table<T extends { id: any }>(
    model: DefaultConstructable<T>,
    options?: SchemaTableOptions<T>,
  ): void;
  table<T>(
    model: DefaultConstructable<T>,
    options: SchemaTableRequiredKeyOptions<T>,
  ): void;
  table<T>(
    model: DefaultConstructable<T>,
    options?: SchemaTableOptions<T>,
  ): void {
    this.tables.push(model);
  }

  view<T>(view: DefaultConstructable<T>, query: SelectSql<T>) {
    this.views.push({ view, query });
  }

  rules(rules: Rule[]) {
    this._rules.push(...rules);
  }

  seed<T>(model: DefaultConstructable<T>, values: T[]) {
    this.seeds.push({ model, values });
  }

  migration(migration: MigrationDescription) {
    this.migrationTree.add(migration);
  }

  getSchemaDescription(): RelationalSchemaDescription {
    return this.migrationTree.getSchemaDescription({
      backwardCompatible: this.options?.backwardCompatible ?? false,
    });
  }

  getRules(): Rule[] {
    return this._rules;
  }

  getMigrations(): MigrationTree {
    return this.migrationTree;
  }

  getMapper(): RelationalMapper {
    if (this.options?.backwardCompatible) {
      return new RelationalBackwardCompatibleMapper(
        this.getSchemaDescription(),
      );
    } else {
      return new RelationalNormalMapper();
    }
  }
}
