import { MigrationDescription, MigrationTree } from '../migration';
import { SchemaTableOptions } from './schema-table-options';
import { RelationalSchemaOptions } from './relational-schema-options';
import { RelationalSchemaDescription } from './description/relational-schema-description';
import { Constructable, DefaultConstructable } from '@daita/common';
import { RelationalMapper } from '../context/relational-mapper';
import { RelationalBackwardCompatibleMapper, RelationalNormalMapper } from '../context/orm-mapper';
import { Rule } from '@daita/relational';

export class RelationalSchema {
  private migrationTree = new MigrationTree();
  private rules: Rule[] = [];
  private tables: Constructable<any>[] = [];

  schema: string | null = null;

  constructor(private options?: RelationalSchemaOptions) {
    if (options && options.schema) {
      this.schema = options.schema;
    }
  }

  table<T extends { id: any }>(model: DefaultConstructable<T>): void;
  table<T>(
    model: DefaultConstructable<T>,
    options: SchemaTableOptions<T>,
  ): void;
  table<T>(
    model: DefaultConstructable<T>,
    options?: SchemaTableOptions<T>,
  ): void {
    this.tables.push(model);
    if (options?.rules) {
      this.rules.push(...options.rules);
    }
  }

  rule<T>(...rules: Rule[]) {
    this.rules.push(...rules);
  }

  migration(migration: MigrationDescription) {
    this.migrationTree.add(migration);
  }

  getSchemaDescription(): RelationalSchemaDescription {
    return this.migrationTree.getSchemaDescription({ backwardCompatible: this.options?.backwardCompatible ?? false });
  }

  getRules(): Rule[] {
    return this.rules;
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
