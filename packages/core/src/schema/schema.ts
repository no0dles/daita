import {
  DocumentDataAdapter,
  RelationalDataAdapter,
  RelationalTransactionDataAdapter,
} from '../adapter';
import {Constructable, DefaultConstructable} from '../constructable';
import {
  DocumentContext,
  RelationalContext,
  RelationalTransactionContext,
} from '../context';
import {Doc} from '../context/types/document';
import {getMigrationSchema} from './migration-schema-builder';
import {MigrationDescription} from '../migration';
import {MigrationTree} from '../migration/migration-tree';
import {SchemaTableOptions} from './schema-table-options';
import {MigrationSchema} from './migration-schema';
import {
  EqualQuery,
  GreaterThanEqualQuery,
  GreaterThanQuery, InQuery,
  LowerThanEqualQuery,
  LowerThanQuery,
  NotEqualQuery, NotInQuery,
} from '../query';

export type Condition<T> = ValueCondition<T> | AndCondition<T> | OrCondition<T>;

export type ValueCondition<T> = {
  [P in keyof T]?: ConditionFilter<T[P]> | SchemaConstant<T[P]>;
}

export interface SchemaConstant<T> {
  kind: 'now' | 'username';
}

export type ConditionFilter<T> = ConditionRegexFilter | //todo only on string
  ConditionLengthFilter | //Todo only on string
  GreaterThanEqualQuery<T> |
  GreaterThanQuery<T> |
  LowerThanEqualQuery<T> |
  LowerThanQuery<T> |
  EqualQuery<T> |
  NotEqualQuery<T> |
  InQuery<T> |
  NotInQuery<T>;

export interface ConditionLengthFilter {
  $length: number | GreaterThanEqualQuery<number> |
    GreaterThanQuery<number> |
    LowerThanEqualQuery<number> |
    LowerThanQuery<number> |
    EqualQuery<number> |
    NotEqualQuery<number> |
    InQuery<number> |
    NotInQuery<number>;
}

export interface ConditionRegexFilter {
  $regex: RegExp;
}

export interface AndCondition<T> {
  $and: Condition<T>[];
}

export interface OrCondition<T> {
  $or: Condition<T>[];
}

export interface TableRule<T> {
  conditions?: Condition<T>;
  insert?: ValueCondition<T>;
  update?: ValueCondition<T>;
}

export interface TablePermission<T> {
  anonymous?: boolean;
  authorized?: boolean;
  roles?: string[];
  users?: string[];
  select?: SelectPermission<T> | true;
  update?: UpdatePermission<T> | true;
  insert?: InsertPermission<T> | true;
  delete?: DeletePermission<T> | true;
}

export interface SelectPermission<T> {
  where?: Condition<T>;
  skip?: ConditionFilter<number>;
  limit?: ConditionFilter<number>;
  deniedFields?: (keyof T)[];
  allowedFields?: (keyof T)[];
}

export interface InsertPermission<T> {
  deniedFields?: (keyof T)[];
  allowedFields?: (keyof T)[];
}

export interface UpdatePermission<T> {
  where?: Condition<T>;
  deniedFields?: (keyof T)[];
  allowedFields?: (keyof T)[];
}

export interface DeletePermission<T> {
  where?: Condition<T>;
}

export interface RelationalSchemaConstants {
  username: SchemaConstant<string>;
  now: SchemaConstant<Date>;
}

export class RelationalSchema {
  private migrationTree = new MigrationTree();
  private tables: Constructable<any>[] = [];

  constants: RelationalSchemaConstants = {
    username: {kind: 'username'},
    now: {kind: 'now'},
  };

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
  }

  migration(migrationType: DefaultConstructable<MigrationDescription>) {
    const migration = new migrationType();
    this.migrationTree.add(migration);
  }

  rule<T>(model: DefaultConstructable<T>, condition: TableRule<T>) {

  }

  permission<T>(model: DefaultConstructable<T>, permission: TablePermission<T>) {

  };

  context(
    dataAdapter: RelationalDataAdapter,
    migrationId?: string,
  ): RelationalContext;
  context(
    dataAdapter: RelationalTransactionDataAdapter,
    migrationId?: string,
  ): RelationalTransactionContext;
  context(
    dataAdapter: RelationalDataAdapter | RelationalTransactionDataAdapter,
    migrationId?: string,
  ): RelationalContext | RelationalTransactionContext {
    if (this.migrationTree.migrationCount === 0) {
      return this.getContext(getMigrationSchema([]), this.migrationTree, dataAdapter);
    }

    if (migrationId) {
      return this.getContext(getMigrationSchema(this.migrationTree.path(migrationId)), this.migrationTree, dataAdapter);
    }

    const lastMigrations = this.migrationTree.last();
    if (lastMigrations.length > 1) {
      throw new Error(`has unresolved migrations`);
    }

    const path = this.migrationTree.path(lastMigrations[0].id);
    const schema = getMigrationSchema(path);

    return this.getContext(schema, this.migrationTree, dataAdapter);
  }

  private getContext(
    schema: MigrationSchema,
    migrationTree: MigrationTree,
    dataAdapter: RelationalDataAdapter | RelationalTransactionDataAdapter,
  ) {
    if (dataAdapter.kind === 'dataAdapter') {
      return new RelationalContext(schema, migrationTree, dataAdapter);
    } else {
      return new RelationalTransactionContext(schema, dataAdapter);
    }
  }
}

export class DocumentSchema {
  private migrationTree = new MigrationTree();
  private collections: Constructable<any>[] = [];

  collection(model: DefaultConstructable<Doc>) {
    this.collections.push(model);
  }

  migration(migrationType: DefaultConstructable<MigrationDescription>) {
    const migration = new migrationType();
    this.migrationTree.add(migration);
  }

  context(dataAdapter: DocumentDataAdapter): DocumentContext {
    if (this.migrationTree.migrationCount === 0) {
      return new DocumentContext(getMigrationSchema([]), this.migrationTree, dataAdapter);
    }

    const lastMigrations = this.migrationTree.last();
    if (lastMigrations.length > 1) {
      throw new Error(`has unresolved migrations`);
    }

    const path = this.migrationTree.path(lastMigrations[0].id);
    const schema = getMigrationSchema(path);
    return new DocumentContext(schema, this.migrationTree, dataAdapter);
  }
}
