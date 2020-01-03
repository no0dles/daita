import {MigrationDescription} from './migration-description';
import {MigrationSchema} from '../schema/migration-schema';
import {RelationalDataAdapter} from '../adapter';
import {RelationalAddTableMigrationStep} from './steps/relation-add-table.migration-step';
import {RelationalAddTableFieldMigrationStep} from './steps/relational-add-table-field.migration-step';
import {RelationalDropTableMigrationStep} from './steps/relational-drop-table.migration-step';
import {RelationalAddTablePrimaryKey} from './steps/relational-add-table-primary-key.migration-step';
import {RelationalAddTableForeignKey} from './steps/relational-add-table-foreign-key.migration-step';
import {Table} from './migration';

export class MigrationExecution {

  async init(dataAdapter: RelationalDataAdapter) {
    await dataAdapter.raw(`CREATE TABLE IF NOT EXISTS "migrations" (id varchar NOT NULL PRIMARY KEY)`, []);
  }

  async exists(id: string, dataAdapter: RelationalDataAdapter) {
    const result = await dataAdapter.raw('SELECT "id" FROM "migrations" WHERE "id" = $1 LIMIT 1', [id]);
    return result.rowCount > 0;
  }

  plan(migration: MigrationDescription, schema: MigrationSchema, dataAdapter: RelationalDataAdapter): string[] {
    const sqls: string[] = [];
    const tables: { [key: string]: Table } = {};

    for (const step of migration.steps) {
      if (step instanceof RelationalAddTableMigrationStep) {
        tables[step.table] = {
          tableName: `${migration.id}_${step.table}`,
          fields: {},
          primaryKeys: [],
          foreignKeys: [],
        };
      } else if (step instanceof RelationalAddTableFieldMigrationStep) {
        if (tables[step.table]) {
          tables[step.table].fields[`${migration.id}_${step.fieldName}`] = {
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
            `ALTER TABLE "${table.sourceMigration.id}_${
              step.table
            }" ADD COLUMN "${migration.id}_${
              step.fieldName
            }" ${dataAdapter.sqlBuilder.getType(step.type)};`,
          );
        }
      } else if (step instanceof RelationalDropTableMigrationStep) {
        const table = schema.table(step.table);
        if (!table) {
          throw new Error(`did not find table ${step.table}`);
        }
        sqls.push(`DROP TABLE "${table.sourceMigration.id}_${step.table}";`);
      } else if (step instanceof RelationalAddTablePrimaryKey) {
        if (tables[step.table]) {
          tables[step.table].primaryKeys = step.fieldNames.map(field => `"${migration.id}_${field}"`);
        } else {
          throw new Error(`can not modify primary key for ${step.table}`);
        }
      } else if (step instanceof RelationalAddTableForeignKey) {
        if (tables[step.table]) {
          const foreignTable = schema.table(step.foreignTable);
          if(foreignTable) {
            tables[step.table].foreignKeys.push({
              table: `"${foreignTable.sourceMigration.id}_${step.foreignTable}"`,
              keys: step.fieldNames.map(field => `"${migration.id}_${field}"`),
              foreignKeys: step.foreignFieldNames.map(field => `"${foreignTable.sourceMigration.id}_${field}"`),
            });
          } else {
            tables[step.table].foreignKeys.push({
              table: `"${migration.id}_${step.foreignTable}"`,
              keys: step.fieldNames.map(field => `"${migration.id}_${field}"`),
              foreignKeys: step.foreignFieldNames.map(field => `"${migration.id}_${field}"`),
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
            `ALTER TABLE "${table.sourceMigration.id}_${
              step.table
            }" ADD FOREIGN KEY (${fields.join(', ')}) REFERENCES "${foreignTable.sourceMigration.id}_${foreignTable.name}" (${foreignFields.join(', ')});`,
          );
        }
      }
    }

    for (const tableName of Object.keys(tables)) {
      const table = tables[tableName];
      const fields = Object.keys(table.fields).map(fieldName => {
        const field = table.fields[fieldName];
        return `"${fieldName}" ${dataAdapter.sqlBuilder.getType(field.type)}`.trim();
      });
      const primaryKeys = table.primaryKeys.length > 0 ? [`PRIMARY KEY (${table.primaryKeys.join(', ')})`] : [];

      sqls.push(`CREATE TABLE "${table.tableName}" (${[...fields, ...primaryKeys].join(', ')});`);
    }

    for (const tableName of Object.keys(tables)) {
      const table = tables[tableName];
      const foreignKeys = table.foreignKeys.map(key => `FOREIGN KEY (${key.keys.join(', ')}) REFERENCES ${key.table} (${key.foreignKeys.join(', ')})`);
      for (const foreignKey of foreignKeys) {
        sqls.push(
          `ALTER TABLE "${table.tableName}" ADD ${foreignKey};`,
        );
      }
    }

    return sqls;
  }

  async apply(migration: MigrationDescription, schema: MigrationSchema, dataAdapter: RelationalDataAdapter) {
    const sqls = this.plan(migration, schema, dataAdapter);

    await dataAdapter.transaction(async client => {
      await client.raw(`LOCK TABLE "migrations"`, []);
      await client.raw('INSERT INTO "migrations" ("id") VALUES ($1)', [migration.id]);

      for (const sql of sqls) {
        console.log(sql);
        await client.raw(sql, []);
      }
    });
  }
}
