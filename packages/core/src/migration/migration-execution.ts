import { MigrationDescription } from './migration-description';
import { MigrationSchema } from '../schema/migration-schema';
import { Table } from './migration';
import * as debug from 'debug';
import {RelationalMigrationAdapter} from '../adapter/relational-migration-adapter';

export class MigrationExecution {
  async init(dataAdapter: RelationalMigrationAdapter) {
    await dataAdapter.raw(
      `CREATE SCHEMA IF NOT EXISTS "daita";`,
      [],
    );
    await dataAdapter.raw(
      `CREATE TABLE IF NOT EXISTS "daita"."migrations" (id varchar NOT NULL PRIMARY KEY)`,
      [],
    );
  }

  async exists(id: string, dataAdapter: RelationalMigrationAdapter) {
    const result = await dataAdapter.raw(
      'SELECT "id" FROM "daita"."migrations" WHERE "id" = $1 LIMIT 1',
      [id],
    );
    return result.rowCount > 0;
  }

  plan(
    migration: MigrationDescription,
    schema: MigrationSchema,
    dataAdapter: RelationalMigrationAdapter,
  ): string[] {
    const sqls: string[] = [];
    const tables: { [key: string]: Table } = {};

    for (const step of migration.steps) {
      if (step.kind === 'add_table') {
        tables[step.table] = {
          tableName: `${step.table}_${migration.id}`,
          fields: {},
          primaryKeys: [],
          foreignKeys: [],
        };
      } else if (step.kind === 'add_table_field') {
        if (tables[step.table]) {
          tables[step.table].fields[`${step.fieldName}_${migration.id}`] = {
            type: step.type,
            required: step.required,
            defaultValue: step.defaultValue,
          };
        } else {
          const table = schema.table(step.table);
          if (!table) {
            throw new Error(`did not find table ${step.table}`);
          }
          sqls.push(
            `ALTER TABLE "${
              step.table
            }_${table.sourceMigration.id}" ADD COLUMN "${
              step.fieldName
            }_${migration.id}" ${dataAdapter.sqlBuilder.getType(step.type)};`,
          );
        }
      } else if (step.kind === 'drop_table') {
        const table = schema.table(step.table);
        if (!table) {
          throw new Error(`did not find table ${step.table}`);
        }
        sqls.push(`DROP TABLE "${step.table}_${table.sourceMigration.id}";`);
      } else if (step.kind === 'add_table_primary_key') {
        if (tables[step.table]) {
          tables[step.table].primaryKeys = step.fieldNames.map(
            field => `"${field}_${migration.id}"`,
          );
        } else {
          throw new Error(`can not modify primary key for ${step.table}`);
        }
      } else if (step.kind === 'add_table_foreign_key') {
        if (tables[step.table]) {
          const foreignTable = schema.table(step.foreignTable);
          if (foreignTable) {
            tables[step.table].foreignKeys.push({
              table: `"${step.foreignTable}_${foreignTable.sourceMigration.id}"`,
              keys: step.fieldNames.map(field => `"${field}_${migration.id}"`),
              foreignKeys: step.foreignFieldNames.map(
                field => `"${field}_${foreignTable.sourceMigration.id}"`,
              ),
            });
          } else {
            tables[step.table].foreignKeys.push({
              table: `"${step.foreignTable}_${migration.id}"`,
              keys: step.fieldNames.map(field => `"${field}_${migration.id}"`),
              foreignKeys: step.foreignFieldNames.map(
                field => `"${field}_${migration.id}"`,
              ),
            });
          }
        } else {
          const table = schema.table(step.table);
          const foreignTable = schema.table(step.foreignTable);
          if (!table) {
            throw new Error(`did not find table ${step.table}`);
          }
          if (!foreignTable) {
            throw new Error(`did not find table ${step.foreignTable}`);
          }
          const fields: string[] = [];
          for (const field of step.fieldNames) {
            const migrationField = table.field(field);
            fields.push(`"${migrationField.baseFieldName}"`);
          }
          const foreignFields: string[] = [];
          for (const field of step.foreignFieldNames) {
            const migrationField = foreignTable.field(field);
            foreignFields.push(`"${migrationField.baseFieldName}"`);
          }
          sqls.push(
            `ALTER TABLE "${
              step.table
            }_${table.sourceMigration.id}" ADD FOREIGN KEY (${fields.join(', ')}) REFERENCES "${foreignTable.name}_${
              foreignTable.sourceMigration.id
            }" (${foreignFields.join(', ')});`,
          );
        }
      }
    }

    for (const tableName of Object.keys(tables)) {
      const table = tables[tableName];
      const fields = Object.keys(table.fields).map(fieldName => {
        const field = table.fields[fieldName];
        return `"${fieldName}" ${dataAdapter.sqlBuilder.getType(
          field.type,
        )}`.trim();
      });
      const primaryKeys =
        table.primaryKeys.length > 0
          ? [`PRIMARY KEY (${table.primaryKeys.join(', ')})`]
          : [];

      sqls.push(
        `CREATE TABLE "${table.tableName}" (${[...fields, ...primaryKeys].join(
          ', ',
        )});`,
      );
    }

    for (const tableName of Object.keys(tables)) {
      const table = tables[tableName];
      const foreignKeys = table.foreignKeys.map(
        key =>
          `FOREIGN KEY (${key.keys.join(', ')}) REFERENCES ${
            key.table
          } (${key.foreignKeys.join(', ')})`,
      );
      for (const foreignKey of foreignKeys) {
        sqls.push(`ALTER TABLE "${table.tableName}" ADD ${foreignKey};`);
      }
    }

    return sqls;
  }

  async apply(
    migration: MigrationDescription,
    schema: MigrationSchema,
    dataAdapter: RelationalMigrationAdapter,
  ) {
    const sqls = this.plan(migration, schema, dataAdapter);

    await dataAdapter.transaction(async client => {
      await client.raw(`LOCK TABLE "daita"."migrations"`, []);
      await client.raw('INSERT INTO "daita"."migrations" ("id") VALUES ($1)', [
        migration.id,
      ]);

      for (const sql of sqls) {
        debug('daita:core:migration')(sql);
        await client.raw(sql, []);
      }
    });
  }
}
