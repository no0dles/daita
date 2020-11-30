import { RelationalMigrationAdapter } from '../../orm/adapter/relational-migration-adapter';
import { PostgresSql } from '../sql/postgres-sql';
import { MigrationDescription } from '../../orm/migration/migration-description';
import { field } from '../../relational/sql/keyword/field/field';
import { table } from '../../relational/sql/keyword/table/table';
import { and } from '../../relational/sql/keyword/and/and';
import { equal } from '../../relational/sql/operands/comparison/equal/equal';
import { Client } from '../../relational/client/client';
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
import { MigrationPlan } from '../../orm/context/relational-migration-context';
import { MigrationStorage } from '../../orm/migration/schema/migration-schema';

export class PostgresMigrationAdapter extends PostgresAdapter implements RelationalMigrationAdapter<PostgresSql> {
  private storage = new MigrationStorage();
  private client: TransactionClient<PostgresSql>;

  constructor(poolOrUrl: string | Promise<Pool> | Pool, options: { listenForNotifications: boolean }) {
    super(poolOrUrl, options);
    this.client = new RelationalTransactionClient(this);
  }

  getClient(handle: Promise<void>): Promise<Client<PostgresSql>> {
    const defer = new Defer<Client<PostgresSql>>();
    this.client.transaction(async (trx) => {
      await this.storage.initalize(trx);
      await trx.exec({ lockTable: table(Migrations) });
      defer.resolve(trx);
      await handle;
      await trx.exec({ notify: 'daita_migrations' });
    });
    return defer.promise;
  }

  async getAppliedMigrations(client: Client<PostgresSql>, schema: string): Promise<MigrationDescription[]> {
    await this.storage.initalize(client);
    return this.storage.get(client, name);
  }

  async applyMigration(client: Client<PostgresSql>, schema: string, migrationPlan: MigrationPlan): Promise<void> {
    await this.storage.initalize(client);
    const createTables: { [key: string]: CreateTableSql } = {};

    await this.storage.add(client, schema, migrationPlan.migration);
    for (const step of migrationPlan.migration.steps) {
      if (step.kind === 'add_table') {
        if (step.schema) {
          await client.exec({
            createSchema: step.schema,
          });
        }

        const tbl = table(step.table, step.schema);
        const key = getTableDescriptionIdentifier(tbl);
        const isAddTableFieldStep = (val: MigrationStep): val is RelationalAddTableFieldMigrationStep =>
          val.kind === 'add_table_field';

        createTables[key] = {
          createTable: tbl,
          columns: migrationPlan.migration.steps
            .filter(isAddTableFieldStep)
            .filter((s) => s.table === step.table && s.schema === step.schema)
            .map((columnStep) => ({
              name: columnStep.fieldName,
              type: columnStep.type,
              primaryKey: migrationPlan.migration.steps.some(
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
    }
  }

  private getWhere(tableDescription: TableDescription<any>, keys: any): ConditionDescription {
    const conditions = Object.keys(keys).map((key) => equal(field(tableDescription, key), keys[key]));
    if (conditions.length === 0) {
      throw new Error('seed requires at least 1 key');
    }
    return and(...(conditions as any));
  }
  toString() {
    return 'postgres';
  }
}
