import { SchemaTableOptions, SchemaTableRequiredKeyOptions } from './schema-table-options';
import { DefaultRelationalSchemaOptions, RelationalSchemaOptions } from './relational-schema-options';
import { RelationalMapper } from '../context/relational-mapper';
import { RelationalBackwardCompatibleMapper, RelationalNormalMapper } from '../context/orm-mapper';
import { OrmRelationalSchema } from './orm-relational-schema';
import { SelectSql } from '@daita/relational';
import { MigrationAdapter, UpDownMigrationDescription } from '../migration/migration-description';
import { MigrationTree } from '../migration/migration-tree';
import { Rule } from '@daita/relational';
import { Constructable, DefaultConstructable } from '@daita/common';
import { SchemaDescription } from './description/relational-schema-description';
import { getMigrationTreeSchema } from './migration-tree-schema';
import { OrmSql } from '../migration';

class MigrationRecorderAdapter<TSql> implements MigrationAdapter<TSql> {
  recordedSqls: TSql[] = [];

  exec(sql: TSql): void {
    this.recordedSqls.push(sql);
  }
}

export class RelationalSchema<TSql = OrmSql> implements OrmRelationalSchema<TSql> {
  private migrationTree = new MigrationTree<TSql>(this.options.name);
  private _rules: Rule[] = [];
  private tables: Constructable<any>[] = [];
  private views: { view: Constructable<any>; query: SelectSql<any> }[] = [];
  private seeds: { model: DefaultConstructable<any>; values: any[] }[] = [];

  schema: string | null = null;

  constructor(private options: RelationalSchemaOptions<TSql> | DefaultRelationalSchemaOptions<OrmSql>) {
    if (options.schema) {
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

  migration(migration: UpDownMigrationDescription<TSql>) {
    this.migrationTree.add({
      id: migration.id,
      after: migration.after,
      resolve: migration.resolve,
      upMigration: this.getSqlsFromMigration(migration.up),
      downMigration: this.getSqlsFromMigration(migration.down),
    });
  }

  private getSqlsFromMigration(fn: (client: MigrationAdapter<TSql>) => void): TSql[] {
    const adapter = new MigrationRecorderAdapter<TSql>();
    fn(adapter);
    return adapter.recordedSqls;
  }

  private getSchemaDescription(): SchemaDescription {
    return getMigrationTreeSchema(this.migrationTree);
  }

  getRules(): Rule[] {
    return this._rules;
  }

  getMigrations(): MigrationTree<TSql> {
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
