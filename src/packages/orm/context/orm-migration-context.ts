import { getTableDescriptionIdentifier } from '../schema';
import { MigrationTree } from '../migration';
import { MigrationContext } from './get-migration-context';
import {
  AlterTableSql,
  and,
  Condition,
  CreateIndexSql,
  CreateSchemaSql,
  CreateTableSql,
  CreateViewSql,
  DeleteSql,
  DropIndexSql,
  DropTableSql,
  DropViewSql,
  equal,
  field,
  InsertSql,
  LockTableSql,
  SelectSql,
  table,
  TableDescription,
  UpdateSql,
} from '../../relational/sql';
import { failNever } from '../../common/utils';
import { RelationDoesNotExistsError } from '../../relational/error';
import { Client, TransactionClient } from '../../relational/client';
import { parseRule } from '../../relational/permission';

class Migrations {
  static schema = 'daita';
  static table = 'migrations';

  id!: string;
}

class Rules {
  static schema = 'daita';
  static table = 'rules';

  id!: string;
  rule!: string;
}

export type MigrationSql =
  | LockTableSql
  | CreateSchemaSql
  | CreateTableSql
  | DropTableSql
  | AlterTableSql
  | CreateIndexSql<any>
  | DropIndexSql
  | DeleteSql
  | UpdateSql<any>
  | InsertSql<any>
  | CreateViewSql<any>
  | DropViewSql;

export class OrmRuleContext {
  constructor(private client: Client<SelectSql<any>>) {}

  async getRules() {
    try {
      const rules = await this.client.select({
        select: {
          id: field(Rules, 'id'),
          rule: field(Rules, 'rule'),
        },
        from: table(Rules),
      });
      return rules.map((rule) => parseRule(rule.rule));
    } catch (e) {
      if (e instanceof RelationDoesNotExistsError) {
        return [];
      }
      throw e;
    }
  }
}

export class OrmMigrationContext implements MigrationContext {
  constructor(
    private client: TransactionClient<MigrationSql>,
    private migrationTree: MigrationTree,
  ) {}

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
      if (e instanceof RelationDoesNotExistsError) {
        sqls.push({ createSchema: 'daita', ifNotExists: true });
        sqls.push({
          createTable: table(Migrations),
          ifNotExists: true,
          columns: [
            { name: 'id', type: 'string', notNull: true, primaryKey: true },
          ],
        });
      } else {
        throw e;
      }
    }

    sqls.push({ lockTable: table(Migrations) });

    sqls.push({
      createTable: table(Rules),
      ifNotExists: true,
      columns: [
        { name: 'id', type: 'string', notNull: true, primaryKey: true },
        { name: 'rule', type: 'string', notNull: true, primaryKey: false },
      ],
    });

    let currentMigrations = this.migrationTree.roots();

    while (currentMigrations.length > 0) {
      if (currentMigrations.length > 1) {
        throw new Error('multiple possible next migrations');
      }

      const currentMigration = currentMigrations[0];

      if (!appliedMigrations.some((m) => m.id === currentMigration.id)) {
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
            if (createTables[key]) {
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
                },
              });
            }
          } else if (step.kind === 'add_table_primary_key') {
            const tbl = table(step.table, step.schema);
            const key = getTableDescriptionIdentifier(tbl);
            for (const fieldName of step.fieldNames) {
              const field = createTables[key].columns.filter(
                (c) => c.name === fieldName,
              )[0];
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
          } else if (step.kind === 'drop_table_foreign_key') {
            sqls.push({
              alterTable: table(step.table, step.schema),
              drop: {
                constraint: step.name,
              },
            });
          } else if (step.kind === 'add_rule') {
            sqls.push({
              into: table(Rules),
              insert: { id: step.ruleId, rule: JSON.stringify(step.rule) },
            });
          } else if (step.kind === 'drop_rule') {
            sqls.push({
              delete: table(Rules),
              where: equal(field(Rules, 'id'), step.ruleId),
            });
          } else if (step.kind === 'add_view') {
            sqls.push({
              createView: table(step.view, step.schema),
              as: step.query,
            });
          } else if (step.kind === 'alter_view') {
            sqls.push({
              createView: table(step.view, step.schema),
              orReplace: true,
              as: step.query,
            });
          } else if (step.kind === 'drop_view') {
            sqls.push({
              dropView: table(step.view, step.schema),
            });
          } else if (step.kind === 'insert_seed') {
            sqls.push({
              insert: { ...step.keys, ...step.seed },
              into: table(step.table, step.schema),
            });
          } else if (step.kind === 'update_seed') {
            const tbl = table(step.table, step.schema);
            sqls.push({
              update: tbl,
              set: step.seed,
              where: this.getWhere(tbl, step.keys),
            });
          } else if (step.kind === 'delete_seed') {
            const tbl = table(step.table, step.schema);
            sqls.push({
              delete: tbl,
              where: this.getWhere(tbl, step.keys),
            });
          } else {
            failNever(step, 'unknown migration step');
          }
        }

        sqls.push({
          insert: { id: currentMigration.id },
          into: table(Migrations),
        });
      }

      currentMigrations = this.migrationTree.next(currentMigration.id);
    }

    return sqls;
  }

  private getWhere(
    tableDescription: TableDescription<any>,
    keys: any,
  ): Condition {
    const conditions = Object.keys(keys).map((key) =>
      equal(field(tableDescription, key), keys[key]),
    );
    if (conditions.length === 0) {
      throw new Error('seed requires at least 1 key');
    }
    return and(...(conditions as any));
  }

  async update(trx?: Client<MigrationSql>): Promise<void> {
    if (trx) {
      await this.runUpdate(trx);
    } else {
      await this.client.transaction(async (trx) => {
        await this.runUpdate(trx);
      });
    }
  }

  private async runUpdate(trx: Client<MigrationSql>) {
    const pendingSqls = await this.pendingUpdates();
    for (const sql of pendingSqls) {
      await trx.exec(sql);
    }
  }
}