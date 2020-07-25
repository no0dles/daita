import {
  table,
  field,
  TransactionClient,
  SelectClient,
  Client,
  LockTableSql,
  CreateSchemaSql,
  CreateTableSql,
  AlterTableSql, InsertSql, DropTableSql, CreateIndexSql, DropIndexSql,
} from '@daita/relational';
import { getTableDescriptionIdentifier } from '../schema';
import { MigrationTree } from '../migration';
import { failNever } from '@daita/common';
import { MigrationContext } from './get-migration-context';

class Migrations {
  static schema = 'daita';
  static table = 'migrations';

  id!: string;
}

export type MigrationSql =
  LockTableSql
  | CreateSchemaSql
  | CreateTableSql
  | DropTableSql
  | AlterTableSql
  | CreateIndexSql<any>
  | DropIndexSql
  | InsertSql<any>;

export class OrmMigrationContext implements MigrationContext {
  constructor(private client: TransactionClient<Client<MigrationSql> & SelectClient> & SelectClient,
              private migrationTree: MigrationTree) {

  }

  async needsUpdate(): Promise<boolean> {
    const updates = await this.pendingUpdates();
    return updates.length > 0;
  }

  async pendingUpdates(): Promise<MigrationSql[]> {
    const sqls: MigrationSql[] = [];
    const appliedMigrations: { id: string }[] = [];

    try {
      const result = await this.client.select({
        select: {
          id: field(Migrations, 'id'),
        },
        from: table(Migrations),
      });
      appliedMigrations.push(...result);
    } catch (e) {
      //TODO check if error is table related
      sqls.push({ createSchema: 'daita', ifNotExists: true });
      sqls.push({
        createTable: table(Migrations),
        ifNotExists: true,
        columns: [
          { name: 'id', type: 'string', notNull: true, primaryKey: true },
        ],
      });
    }

    sqls.push({ lockTable: table(Migrations) });

    let currentMigrations = this.migrationTree.roots();

    while (currentMigrations.length > 0) {
      if (currentMigrations.length > 1) {
        throw new Error('multiple possible next migrations');
      }

      const currentMigration = currentMigrations[0];

      if (!appliedMigrations.some(m => m.id === currentMigration.id)) {
        const createTables: { [key: string]: CreateTableSql } = {};

        for (const step of currentMigration.steps) {
          if (step.kind === 'add_table') {
            const tbl = table(step.table, step.schema);
            const key = getTableDescriptionIdentifier(tbl);
            createTables[key] = {
              createTable: tbl,
              columns: [],
            };
            sqls.push(createTables[key]);
          } else if (step.kind === 'add_table_field') {
            const tbl = table(step.table, step.schema);
            const key = getTableDescriptionIdentifier(tbl);
            if(createTables[key]) {
              createTables[key].columns.push({
                name: step.fieldName,
                type: step.type,
                primaryKey: false,
                notNull: false,
              });
            } else {
              sqls.push({
                alterTable: tbl,
                add: {
                  column: step.fieldName,
                  type: step.type,
                  //TODO notnull missing?
                }
              })
            }
          } else if (step.kind === 'add_table_primary_key') {
            const tbl = table(step.table, step.schema);
            const key = getTableDescriptionIdentifier(tbl);
            for (const fieldName of step.fieldNames) {
              const field = createTables[key].columns.filter(c => c.name === fieldName)[0];
              field.primaryKey = true;
            }
            //TODO optimize
          } else if (step.kind === 'add_table_foreign_key') {
            sqls.push({
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
          } else if (step.kind === 'drop_table') {
            sqls.push({
              dropTable: table(step.table, step.schema),
            });
          } else if (step.kind === 'drop_table_field') {
            sqls.push({
              alterTable: table(step.table, step.schema),
              drop: {
                column: step.fieldName,
              },
            });
          } else if (step.kind === 'create_index') {
            sqls.push({
              createIndex: step.name,
              on: table(step.table, step.schema),
              columns: step.fields,
              unique: step.unique ?? false,
            });
          } else if (step.kind === 'drop_index') {
            sqls.push({
              dropIndex: step.name,
              on: table(step.table, step.schema),
            });
          } else {
            failNever(step, 'unknown migration step');
          }
        }

        sqls.push({ insert: { id: currentMigration.id }, into: table(Migrations) });
      }

      currentMigrations = this.migrationTree.next(currentMigration.id);
    }

    return sqls;
  }

  async update(trx?: Client<MigrationSql> & SelectClient): Promise<void> {
    if (trx) {
      await this.runUpdate(trx);
    } else {
      await this.client.transaction(async trx => {
        await this.runUpdate(trx);
      });
    }
  }

  private async runUpdate(trx: Client<MigrationSql> & SelectClient) {
    const pendingSqls = await this.pendingUpdates();
    for (const sql of pendingSqls) {
      await trx.exec(sql);
    }
  }
}
