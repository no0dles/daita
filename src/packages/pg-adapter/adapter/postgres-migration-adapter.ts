import { RelationalMigrationAdapter, MigrationDirection } from '../../orm/adapter/relational-migration-adapter';
import { PostgresSql } from '../sql/postgres-sql';
import { MigrationDescription } from '../../orm/migration/migration-description';
import { field } from '../../relational/sql/keyword/field/field';
import { table } from '../../relational/sql/keyword/table/table';
import { join } from '../../relational/sql/dml/select/join/join';
import { and } from '../../relational/sql/keyword/and/and';
import { equal } from '../../relational/sql/operands/comparison/equal/equal';
import { asc } from '../../relational/sql/keyword/asc/asc';
import { Client } from '../../relational/client/client';
import { parseRule, serializeRule } from '../../relational/permission/parsing';
import { CreateTableSql } from '../../relational/sql/ddl/create-table/create-table-sql';
import { getTableDescriptionIdentifier } from '../../orm/schema/description/relational-schema-description';
import { failNever } from '../../common/utils/fail-never';
import { TableDescription } from '../../relational/sql/keyword/table/table-description';
import { ConditionDescription } from '../../relational/sql/operands/condition-description';
import { TransactionClient } from '../../relational/client/transaction-client';
import { Defer } from '../../common/utils/defer';
import { RelationalAddTableFieldMigrationStep } from '../../orm/migration/steps/relational-add-table-field.migration-step';
import { MigrationStep } from '../../orm/migration/migration-step';
import { PostgresAdapter } from './postgres.adapter';
import { Pool } from 'pg';
import { RelationalTransactionClient } from '../../relational/client/relational-transaction-client';

class Migrations {
  static schema = 'daita';
  static table = 'migrations';

  id!: string;
  schema!: string;
}

class MigrationSteps {
  static schema = 'daita';
  static table = 'migrationSteps';

  migrationId!: string;
  migrationSchema!: string;
  index!: number;
  step!: string;
}

class Rules {
  static schema = 'daita';
  static table = 'rules';

  id!: string;
  rule!: string;
}

export class PostgresMigrationAdapter extends PostgresAdapter implements RelationalMigrationAdapter<PostgresSql> {
  private initalizedSchema = false;
  private client: TransactionClient<PostgresSql>;

  constructor(poolOrUrl: string | Promise<Pool> | Pool, options: { listenForNotifications: boolean }) {
    super(poolOrUrl, options);
    this.client = new RelationalTransactionClient(this);
  }

  getClient(handle: Promise<void>): Promise<Client<PostgresSql>> {
    const defer = new Defer<Client<PostgresSql>>();
    this.client.transaction(async (trx) => {
      await this.updateInternalSchema(trx);
      await trx.exec({ lockTable: table(Migrations) });
      defer.resolve(trx);
      await handle;
      await trx.exec({ notify: 'daita_migrations' });
    });
    return defer.promise;
  }

  // async getRules(): Promise<Rule[]> {
  //   await this.client.transaction(async (trx) => {
  //     await this.updateInternalSchema(trx);
  //   });
  //
  //   const rules = await this.client.select({
  //     select: {
  //       id: field(Rules, 'id'),
  //       rule: field(Rules, 'rule'),
  //     },
  //     from: table(Rules),
  //   });
  //   return rules.map((rule) => parseRule(rule.rule));
  // }

  private async updateInternalSchema(client: Client<PostgresSql>) {
    if (this.initalizedSchema) {
      return;
    }
    await client.exec({ createSchema: 'daita', ifNotExists: true });
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
    // await client.exec({
    //   createTable: table(Rules),
    //   ifNotExists: true,
    //   columns: [
    //     { name: 'id', type: 'string', notNull: true, primaryKey: true },
    //     { name: 'rule', type: 'string', notNull: true, primaryKey: false },
    //   ],
    // });
    this.initalizedSchema = true;
  }

  async getAppliedMigrations(client: Client<PostgresSql>, schema: string): Promise<MigrationDescription[]> {
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

  async applyMigration(
    client: Client<PostgresSql>,
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
        await client.exec({
          alterTable: table(step.table, step.schema),
          drop: {
            constraint: `${step.table}_pkey`,
          },
        });
      } else if (step.kind === 'drop_table') {
        await client.exec({
          dropTable: table(step.table, step.schema),
        });
      } else if (step.kind === 'drop_table_field') {
        await client.exec({
          alterTable: table(step.table, step.schema),
          drop: {
            column: step.fieldName,
          },
        });
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
        await client.exec({
          alterTable: table(step.table, step.schema),
          drop: {
            constraint: step.name,
          },
        });
      } else if (step.kind === 'add_rule') {
        await client.exec({
          into: table(Rules),
          insert: { id: step.ruleId, rule: serializeRule(step.rule) },
        });
      } else if (step.kind === 'drop_rule') {
        await client.exec({
          delete: table(Rules),
          where: equal(field(Rules, 'id'), step.ruleId),
        });
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

  private getWhere(tableDescription: TableDescription<any>, keys: any): ConditionDescription {
    const conditions = Object.keys(keys).map((key) => equal(field(tableDescription, key), keys[key]));
    if (conditions.length === 0) {
      throw new Error('seed requires at least 1 key');
    }
    return and(...(conditions as any));
  }
}
