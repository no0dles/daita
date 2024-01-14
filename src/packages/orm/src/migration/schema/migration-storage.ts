import { field, RelationalAdapter, RelationalTransactionAdapter, StorageOptions, table } from '@daita/relational';
import { CreateSchemaSql } from '@daita/relational';
import { MigrationDescription } from '../migration-description';
import { join } from '@daita/relational';
import { and } from '@daita/relational';
import { equal } from '@daita/relational';
import { asc } from '@daita/relational';
import { Migrations } from './migrations';
import { MigrationSteps } from './migration-steps';

export class MigrationStorage {
  private initialized = false;
  constructor(private adapter: RelationalAdapter<any>, private options: StorageOptions) {}

  async initialize() {
    if (this.initialized) {
      return;
    }

    await this.adapter.transaction((trx) => {
      const createSchema: CreateSchemaSql = { createSchema: 'daita', ifNotExists: true };
      if (this.adapter.supportsQuery(createSchema)) {
        trx.exec(createSchema);
      }
      trx.exec({
        createTable: table(Migrations),
        ifNotExists: true,
        columns: [
          {
            name: 'id',
            type: this.options.idType.type,
            size: this.options.idType.size,
            notNull: true,
            primaryKey: true,
          },
          {
            name: 'after',
            type: this.options.idType.type,
            size: this.options.idType.size,
            notNull: false,
          },
          {
            name: 'resolve',
            type: this.options.idType.type,
            size: this.options.idType.size,
            notNull: false,
          },
          {
            name: 'schema',
            type: this.options.idType.type,
            size: this.options.idType.size,
            notNull: true,
            primaryKey: true,
          },
        ],
      });
      trx.exec({
        createTable: table(MigrationSteps),
        ifNotExists: true,
        columns: [
          {
            name: 'migrationId',
            type: this.options.idType.type,
            size: this.options.idType.size,
            notNull: true,
            primaryKey: true,
          },
          {
            name: 'migrationSchema',
            type: this.options.idType.type,
            size: this.options.idType.size,
            notNull: true,
            primaryKey: true,
          },
          { name: 'index', type: 'number', notNull: true, primaryKey: true },
          { name: 'step', type: 'string', notNull: true, primaryKey: false },
        ],
        foreignKey: {
          migration: {
            key: ['migrationId', 'migrationSchema'],
            references: {
              table: table(Migrations),
              primaryKey: ['id', 'schema'],
            },
          },
        },
      });
    });
    this.initialized = true;
  }

  async get(name: string) {
    const steps = await this.adapter.select({
      select: {
        id: field(Migrations, 'id'),
        schema: field(Migrations, 'schema'),
        resolve: field(Migrations, 'resolve'),
        after: field(Migrations, 'after'),
        index: field(MigrationSteps, 'index'),
        step: field(MigrationSteps, 'step'),
      },
      from: table(MigrationSteps),
      join: [
        join(
          Migrations,
          and(
            equal(field(Migrations, 'id'), field(MigrationSteps, 'migrationId')),
            equal(field(Migrations, 'schema'), field(MigrationSteps, 'migrationSchema')),
          ),
        ),
      ],
      where: equal(field(Migrations, 'schema'), name),
      orderBy: asc(field(MigrationSteps, 'index')),
    });

    const migrationMap = steps.reduce<{ [key: string]: MigrationDescription }>((migrations, step) => {
      if (!migrations[step.id]) {
        migrations[step.id] = { id: step.id, after: step.after, resolve: step.resolve, steps: [] };
      }
      migrations[step.id].steps.push(JSON.parse(step.step));
      return migrations;
    }, {});

    return Object.keys(migrationMap).map((id) => migrationMap[id]);
  }

  add(client: RelationalTransactionAdapter<any>, schema: string, migration: MigrationDescription) {
    client.insert({
      insert: { id: migration.id, schema, resolve: migration.resolve, after: migration.after },
      into: table(Migrations),
    });

    let index = 0;
    for (const step of migration.steps) {
      client.insert({
        insert: {
          migrationId: migration.id,
          migrationSchema: schema,
          step: JSON.stringify(step),
          index: index++,
        },
        into: table(MigrationSteps),
      });
    }
  }
}
