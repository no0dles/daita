import { SchemaTableOptions, SchemaTableRequiredKeyOptions } from './schema-table-options';
import { RelationalSchemaOptions } from './relational-schema-options';
import { RelationalMapper } from '../context/relational-mapper';
import { RelationalBackwardCompatibleMapper, RelationalNormalMapper } from '../context/orm-mapper';
import { OrmRelationalSchema } from './orm-relational-schema';
import { SelectSql } from '@daita/relational';
import { MigrationDescription } from '../migration/migration-description';
import { MigrationTree } from '../migration/migration-tree';
import { Rule } from '@daita/relational';
import { Constructable, DefaultConstructable } from '@daita/common';
import { SchemaDescription } from './description/relational-schema-description';

export class RelationalSchema implements OrmRelationalSchema {
  private migrationTree = new MigrationTree(this.name);
  private _rules: Rule[] = [];
  private tables: Constructable<any>[] = [];
  private views: { view: Constructable<any>; query: SelectSql<any> }[] = [];
  private seeds: { model: DefaultConstructable<any>; values: any[] }[] = [];

  schema: string | null = null;

  constructor(private name: string, private options?: RelationalSchemaOptions) {
    if (options && options.schema) {
      this.schema = options.schema;
    }
  }

  table<T extends { id: any }>(model: DefaultConstructable<T>, options?: SchemaTableOptions<T>): void;
  table<T>(model: DefaultConstructable<T>, options: SchemaTableRequiredKeyOptions<T>): void;
  table<T>(model: DefaultConstructable<T>, options?: SchemaTableOptions<T>): void {
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

  private getSchemaDescription(): SchemaDescription {
    return this.migrationTree.getSchemaDescription().schema;
  }

  getRules(): Rule[] {
    return this._rules;
  }

  getMigrations(): MigrationTree {
    return this.migrationTree;
  }

  getMapper(): RelationalMapper {
    if (this.options?.backwardCompatible) {
      return new RelationalBackwardCompatibleMapper(this.getSchemaDescription());
    } else {
      return new RelationalNormalMapper();
    }
  }
}
