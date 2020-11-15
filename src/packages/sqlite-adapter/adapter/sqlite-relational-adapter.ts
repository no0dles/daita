import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import * as sqlite from 'sqlite3';
import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import { SqliteRelationalDataAdapter } from './sqlite-relational-data-adapter';
import { MigrationDirection, RelationalMigrationAdapter } from '../../orm/adapter/relational-migration-adapter';
import { MigrationDescription } from '../../orm/migration/migration-description';
import { and, asc, Client, CreateTableSql, equal, field, join, table, TableDescription } from '../../relational';
import { Defer, failNever } from '../../common';
import { PostgresSql } from '../../pg-adapter';
import { RelationalClient } from '../../relational/client/relational-client';
import { getTableDescriptionIdentifier } from '../../orm/schema/description/relational-schema-description';
import { MigrationStep } from '../../orm';
import { RelationalAddTableFieldMigrationStep } from '../../orm/migration/steps/relational-add-table-field.migration-step';
import { SqliteSql } from '../sql/sqlite-sql';
import { ConditionDescription } from '../../relational/sql/operands/condition-description';

class Migrations {
  static table = '_datia_migrations';

  id!: string;
  schema!: string;
}

class MigrationSteps {
  static table = '_datia_migrationSteps';

  migrationId!: string;
  migrationSchema!: string;
  index!: number;
  step!: string;
}

export class SqliteRelationalAdapter
  extends SqliteRelationalDataAdapter
  implements RelationalTransactionAdapter<SqliteSql> {
  constructor(protected fileName: string, closeFn: () => void) {
    super(new (sqlite.verbose().Database)(fileName), closeFn);
  }

  transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
    return this.transactionSerializable.run(async () => {
      await this.db.run('BEGIN');
      try {
        const result = await action(new SqliteRelationalDataAdapter(this.db, () => {}));
        await this.run('COMMIT');
        return result;
      } catch (e) {
        await this.run('ROLLBACK');
        throw e;
      }
    });
  }
}

export class SqliteAdapter extends SqliteRelationalAdapter implements RelationalMigrationAdapter<SqliteSql> {
  private initalizedSchema = false;

  toString() {
    return this.fileName === ':memory:' ? 'sqlite-memory' : 'sqlite-file';
  }

  async applyMigration(
    client: Client<SqliteSql>,
    schema: string,
    migration: MigrationDescription,
    direction: MigrationDirection,
  ): Promise<void> {
    await this.updateInternalSchema(client);

    const createTables: { [key: string]: CreateTableSql } = {};

    await client.exec({
      insert: { id: migration.id, schema },
      into: table(Migrations),
    });

    let index = 0;
    for (const step of migration.steps) {
      if (step.kind === 'add_table') {
        const tbl = table(step.table, step.schema);
        const key = getTableDescriptionIdentifier(tbl);
        const isAddTableFieldStep = (val: MigrationStep): val is RelationalAddTableFieldMigrationStep =>
          val.kind === 'add_table_field';

        createTables[key] = {
          createTable: tbl,
          columns: migration.steps
            .filter(isAddTableFieldStep)
            .filter((s) => s.table === step.table && s.schema === step.schema)
            .map((columnStep) => ({
              name: columnStep.fieldName,
              type: columnStep.type,
              primaryKey: migration.steps.some(
                (s) =>
                  s.kind === 'add_table_primary_key' &&
                  s.schema === step.schema &&
                  s.table === step.table &&
                  s.fieldNames.indexOf(columnStep.fieldName) >= 0,
              ),
              notNull: false,
            })),
        };
        await client.exec(createTables[key]);
      } else if (step.kind === 'add_table_field') {
        const tbl = table(step.table, step.schema);
        const key = getTableDescriptionIdentifier(tbl);
        if (!createTables[key]) {
          await client.exec({
            alterTable: tbl,
            add: {
              column: step.fieldName,
              type: step.type,
              //TODO notnull missing?
            },
          });
        }
      } else if (step.kind === 'add_table_primary_key') {
        const tbl = table(step.table, step.schema);
        const key = getTableDescriptionIdentifier(tbl);
        if (!createTables[key]) {
          // await client.exec({
          //   alterTable: tbl,
          //   add: {
          //     primaryKey: []
          //   },
          // });
          throw new Error('adding primary keys afterwards is not supported yet');
        }
        //TODO optimize
      } else if (step.kind === 'add_table_foreign_key') {
        await client.exec({
          alterTable: table(step.table, step.schema),
          add: {
            constraint: step.name,
            foreignKey: step.fieldNames,
            references: {
              table: table(step.foreignTable, step.foreignTableSchema),
              primaryKeys: step.foreignFieldNames,
            },
          },
        });
      } else if (step.kind === 'drop_table_primary_key') {
        // await client.exec({
        //   alterTable: table(step.table, step.schema),
        //   drop: {
        //     constraint: `${step.table}_pkey`,
        //   },
        // });
        // TODO
      } else if (step.kind === 'drop_table') {
        await client.exec({
          dropTable: table(step.table, step.schema),
        });
      } else if (step.kind === 'drop_table_field') {
        // await client.exec({
        //   alterTable: table(step.table, step.schema),
        //   drop: {
        //     column: step.fieldName,
        //   },
        // });
        // TODO
      } else if (step.kind === 'create_index') {
        await client.exec({
          createIndex: step.name,
          on: table(step.table, step.schema),
          columns: step.fields,
          unique: step.unique ?? false,
        });
      } else if (step.kind === 'drop_index') {
        await client.exec({
          dropIndex: step.name,
          on: table(step.table, step.schema),
        });
      } else if (step.kind === 'drop_table_foreign_key') {
        // await client.exec({
        //   alterTable: table(step.table, step.schema),
        //   drop: {
        //     constraint: step.name,
        //   },
        // });
        // TODO
      } else if (step.kind === 'add_rule') {
      } else if (step.kind === 'drop_rule') {
      } else if (step.kind === 'add_view') {
        await client.exec({
          createView: table(step.view, step.schema),
          as: step.query,
        });
      } else if (step.kind === 'alter_view') {
        await client.exec({
          createView: table(step.view, step.schema),
          orReplace: true,
          as: step.query,
        });
      } else if (step.kind === 'drop_view') {
        await client.exec({
          dropView: table(step.view, step.schema),
        });
      } else if (step.kind === 'insert_seed') {
        await client.exec({
          insert: { ...step.keys, ...step.seed },
          into: table(step.table, step.schema),
        });
      } else if (step.kind === 'update_seed') {
        const tbl = table(step.table, step.schema);
        await client.exec({
          update: tbl,
          set: step.seed,
          where: this.getWhere(tbl, step.keys),
        });
      } else if (step.kind === 'delete_seed') {
        const tbl = table(step.table, step.schema);
        await client.exec({
          delete: tbl,
          where: this.getWhere(tbl, step.keys),
        });
      } else {
        failNever(step, 'unknown migration step');
      }

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

  async getAppliedMigrations(client: Client<SqliteSql>, schema: string): Promise<MigrationDescription[]> {
    await this.updateInternalSchema(client);
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

  getClient(handle: Promise<void>): Promise<Client<SqliteSql>> {
    const defer = new Defer<Client<SqliteSql>>();
    this.transaction(async (trx) => {
      const client = new RelationalClient(trx);
      await this.updateInternalSchema(client);
      defer.resolve(client);
      await handle;
    });
    return defer.promise;
  }

  private async updateInternalSchema(client: Client<PostgresSql>) {
    if (this.initalizedSchema) {
      return;
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

  private getWhere(tableDescription: TableDescription<any>, keys: any): ConditionDescription {
    const conditions = Object.keys(keys).map((key) => equal(field(tableDescription, key), keys[key]));
    if (conditions.length === 0) {
      throw new Error('seed requires at least 1 key');
    }
    return and(...(conditions as any));
  }
}
