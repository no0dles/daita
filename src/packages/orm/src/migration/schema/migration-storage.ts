import { field, json, RelationalAdapter, table } from '@daita/relational';
import { CreateSchemaSql } from '@daita/relational';
import { equal } from '@daita/relational';
import { Migrations } from './migrations';
import { Migration, MigrationTree } from '../migration-tree';
import { RelationalOrmAdapter } from '../../adapter';
import { OrmSql } from '../sql';

export interface MigrationExecution<TSql> {
  migration: Migration<TSql>;
  direction: 'up' | 'down';
  schema: string;
}

export class MigrationStorage<TSql> {
  private initialized = false;
  private readonly idType: string;
  private readonly migrationType: string;

  constructor(private adapter: RelationalAdapter<TSql | OrmSql> & RelationalOrmAdapter) {
    this.idType = adapter.getDatabaseType('string', '255');
    this.migrationType = adapter.getDatabaseType('json');
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    await this.adapter.transaction((trx) => {
      const createSchema: CreateSchemaSql = { createSchema: 'daita', ifNotExists: true };
      if (trx.supportsQuery(createSchema)) {
        trx.exec(createSchema);
      }
      trx.exec({
        createTable: table(Migrations),
        ifNotExists: true,
        columns: [
          {
            name: 'id',
            type: this.idType,
            notNull: true,
            primaryKey: true,
          },
          {
            name: 'after',
            type: this.idType,
            notNull: false,
          },
          {
            name: 'resolve',
            type: this.idType,
            notNull: false,
          },
          {
            name: 'schema',
            type: this.idType,
            notNull: true,
            primaryKey: true,
          },
          {
            name: 'upMigration',
            type: this.migrationType,
            notNull: true,
            primaryKey: false,
          },
          {
            name: 'downMigration',
            type: this.migrationType,
            notNull: true,
            primaryKey: false,
          },
        ],
      });
    });
    this.initialized = true;
  }

  async get(name: string): Promise<MigrationTree<TSql>> {
    const migrations = await this.adapter.select({
      select: {
        id: field(Migrations, 'id'),
        schema: field(Migrations, 'schema'),
        resolve: field(Migrations, 'resolve'),
        after: field(Migrations, 'after'),
        upMigration: field(Migrations, 'upMigration'),
        downMigration: field(Migrations, 'downMigration'),
      },
      where: equal(field(Migrations, 'schema'), name),
    });

    return new MigrationTree<TSql>(
      name,
      migrations.map((m) => ({
        id: m.id,
        after: m.after,
        resolve: m.resolve,
        downMigration: m.downMigration,
        upMigration: m.upMigration,
      })),
    );
  }

  async apply(migration: MigrationExecution<TSql>): Promise<void> {
    await this.adapter.transaction((trx) => {
      const sqls = migration.direction === 'up' ? migration.migration.upMigration : migration.migration.downMigration;
      for (const sql of sqls) {
        trx.exec(sql);
      }

      trx.insert({
        insert: {
          id: migration.migration.id,
          schema: migration.schema,
          resolve: migration.migration.resolve,
          after: migration.migration.after,
          upMigration: json(migration.migration.upMigration),
          downMigration: json(migration.migration.downMigration),
        },
        into: table(Migrations),
      });
    });
  }
}
