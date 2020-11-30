import { field, table } from '../../../relational';
import { Client } from '../../../relational/client/client';
import { CreateSchemaSql } from '../../../relational/sql/ddl/create-schema/create-schema-sql';
import { MigrationDescription } from '../migration-description';
import { join } from '../../../relational/sql/dml/select/join/join';
import { and } from '../../../relational/sql/keyword/and/and';
import { equal } from '../../../relational/sql/operands/comparison/equal/equal';
import { asc } from '../../../relational/sql/keyword/asc/asc';

export class MigrationStorage {
  private initalizedSchema = false;

  constructor() {}

  async initalize(client: Client<any>) {
    if (this.initalizedSchema) {
      return;
    }

    const createSchema: CreateSchemaSql = { createSchema: 'daita', ifNotExists: true };
    if (client.supportsQuery(createSchema)) {
      await client.exec(createSchema);
    }
    await client.exec({
      createTable: table(Migrations),
      ifNotExists: true,
      columns: [
        { name: 'id', type: 'string', notNull: true, primaryKey: true },
        {
          name: 'schema',
          type: 'string',
          notNull: true,
          primaryKey: true,
        },
      ],
    });
    await client.exec({
      createTable: table(MigrationSteps),
      ifNotExists: true,
      columns: [
        {
          name: 'migrationId',
          type: 'string',
          notNull: true,
          primaryKey: true,
        },
        {
          name: 'migrationSchema',
          type: 'string',
          notNull: true,
          primaryKey: true,
        },
        { name: 'index', type: 'number', notNull: true, primaryKey: true },
        { name: 'step', type: 'string', notNull: true, primaryKey: false },
      ],
    });
    await client.exec({
      alterTable: table(MigrationSteps),
      add: {
        foreignKey: ['migrationId', 'migrationSchema'],
        references: {
          table: table(Migrations),
          primaryKeys: ['id', 'schema'],
        },
      },
    });

    this.initalizedSchema = true;
  }

  async get(client: Client<any>, name: string) {
    const steps = await client.select({
      select: {
        id: field(Migrations, 'id'),
        schema: field(Migrations, 'schema'),
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
        migrations[step.id] = { id: step.id, steps: [] };
      }
      migrations[step.id].steps.push(JSON.parse(step.step));
      return migrations;
    }, {});

    return Object.keys(migrationMap).map((id) => migrationMap[id]);
  }

  async add(client: Client<any>, schema: string, migration: MigrationDescription) {
    await client.exec({
      insert: { id: migration.id, schema },
      into: table(Migrations),
    });

    let index = 0;
    for (const step of migration.steps) {
      await client.exec({
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
