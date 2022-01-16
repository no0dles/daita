import { field, RelationalAdapter, RelationalTransactionAdapter, StorageOptions, table } from '@daita/relational';
import { CreateSchemaSql } from '@daita/relational';
import { MigrationDescription } from '../migration-description';
import { join } from '@daita/relational';
import { and } from '@daita/relational';
import { equal } from '@daita/relational';
import { asc } from '@daita/relational';
import { Migrations } from './migrations';
import { MigrationSteps } from './migration-steps';
import { RelationalStorage } from '@daita/relational';

export class MigrationStorage {
  private storage: RelationalStorage;

  constructor(private adapter: RelationalAdapter<any>, private options: StorageOptions) {
    this.storage = new RelationalStorage(async () => {
      const createSchema: CreateSchemaSql = { createSchema: 'daita', ifNotExists: true };
      if (this.adapter.supportsQuery(createSchema)) {
        await adapter.exec(createSchema);
      }
      await adapter.exec({
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
      await adapter.exec({
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
  }

  async get(name: string) {
    await this.storage.ensureInitialized();
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

  async add(
    client: RelationalAdapter<any> | RelationalTransactionAdapter<any>,
    schema: string,
    migration: MigrationDescription,
  ) {
    await this.storage.ensureInitialized();
    await client.insert({
      insert: { id: migration.id, schema, resolve: migration.resolve, after: migration.after },
      into: table(Migrations),
    });

    let index = 0;
    for (const step of migration.steps) {
      await client.insert({
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
