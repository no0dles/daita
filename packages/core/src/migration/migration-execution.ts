import {MigrationDescription} from './migration-description';
import {MigrationSchema} from '../schema/migration-schema';
import {Table} from './migration';
import * as debug from 'debug';
import {RelationalMigrationAdapter} from '../adapter/relational-migration-adapter';
import {SqlDmlQuery} from '../sql/sql-dml-builder';

export class MigrationExecution {
  async init(dataAdapter: RelationalMigrationAdapter) {
    await dataAdapter.raw(
      `CREATE SCHEMA IF NOT EXISTS "daita";`,
      [],
    );
    await dataAdapter.raw({
      createTable: {schema: 'daita', table: 'migrations'},
      fields: [
        {name: 'id', type: 'string', notNull: true, primaryKey: true},
      ],
    });
  }

  async exists(id: string, dataAdapter: RelationalMigrationAdapter) {
    const result = await dataAdapter.raw({
      select: ['id'],
      from: {schema: 'daita', table: 'migrations'},
      where: {
        left: {field: 'id'},
        operand: '=',
        right: id,
      },
      limit: 1,
    });
    return result.rowCount > 0;
  }

  plan(
    migration: MigrationDescription,
    schema: MigrationSchema,
    dataAdapter: RelationalMigrationAdapter,
  ): SqlDmlQuery[] {
    const sqls: SqlDmlQuery[] = [];
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
          sqls.push({
            alterTable: `${step.table}_${table.sourceMigration.id}`,
            add: {
              column: `${step.fieldName}_${migration.id}`,
              type: step.type,
            },
          });
        }
      } else if (step.kind === 'drop_table') {
        const table = schema.table(step.table);
        if (!table) {
          throw new Error(`did not find table ${step.table}`);
        }
        sqls.push({
          dropTable: `${step.table}_${table.sourceMigration.id}`,
        });
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
          sqls.push({
            alterTable: `${step.table}_${table.sourceMigration.id}`,
            add: {
              foreignKey: fields,
              references: {
                table: `${foreignTable.name}_${foreignTable.sourceMigration.id}`,
                primaryKeys: foreignFields,
              },
            },
          });
        }
      }
    }

    for (const tableName of Object.keys(tables)) {
      const table = tables[tableName];

      sqls.push({
        createTable: table.tableName,
        fields: Object.keys(table.fields).map(fieldName => {
          const field = table.fields[fieldName];
          return {
            name: fieldName,
            type: field.type,
            primaryKey: table.primaryKeys.indexOf(fieldName) >= 0,
          };
        }),
      });
    }

    for (const tableName of Object.keys(tables)) {
      const table = tables[tableName];
      for (const foreignKey of table.foreignKeys) {
        sqls.push({
          alterTable: tableName,
          add: {
            constraint: '',
            foreignKey: foreignKey.keys,
            references: {
              table: foreignKey.table,
              primaryKeys: foreignKey.foreignKeys,
            },
          },
        });
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
      await client.raw({insert: {schema: 'daita', table: 'migrations'}, into: ['id'], values: [migration.id]});

      for (const sql of sqls) {
        debug('daita:core:migration')(sql);
        //TODO await client.raw(sql);
      }
    });
  }
}
