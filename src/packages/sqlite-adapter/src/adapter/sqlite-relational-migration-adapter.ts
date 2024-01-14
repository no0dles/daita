import { SqliteSql } from '../sql/sqlite-sql';
import { getTableFromSchema, hasAddTableStep, MigrationStorage, orderSqls, RelationalOrmAdapter } from '@daita/orm';
import { MigrationPlan } from '@daita/orm';
import { createLogger, failNever, parseJson } from '@daita/common';
import { MigrationDescription } from '@daita/orm';
import { addTableAction } from '@daita/orm';
import { addTableFieldAction } from '@daita/orm';
import { dropTableAction } from '@daita/orm';
import { createIndexAction } from '@daita/orm';
import { dropIndexAction } from '@daita/orm';
import { addViewAction } from '@daita/orm';
import { alterViewAction } from '@daita/orm';
import { dropViewAction } from '@daita/orm';
import { insertSeedAction } from '@daita/orm';
import { updateSeedAction } from '@daita/orm';
import { deleteSeedAction } from '@daita/orm';
import { SqliteRelationalTransactionAdapter } from './sqlite-relational-transaction-adapter';
import Sqlite, { Database } from 'better-sqlite3';
import {
  BaseRelationalAdapter,
  DeleteSql,
  InsertSql,
  RelationalAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
  SelectSql,
  table,
  UpdateSql,
} from '@daita/relational';
import { SqliteFormatContext, sqliteFormatter } from '../formatter';
import { dropTableFieldAction, migrateTableAction } from '../orm';

export class SqliteRelationalMigrationAdapter
  extends BaseRelationalAdapter
  implements RelationalOrmAdapter, RelationalAdapter<SqliteSql>
{
  private readonly db: Database;
  protected readonly logger = createLogger({ adapter: 'sqlite', package: 'sqlite' });
  private storage = new MigrationStorage(this, {
    idType: { type: 'string' },
  });

  constructor(private connectionString: string) {
    super();
    this.db = Sqlite(connectionString, {
      verbose: (message, additionalArgs) => {
        this.logger.debug(message, additionalArgs);
      },
    });
  }

  exec(sql: DeleteSql | SelectSql<any> | UpdateSql<any> | InsertSql<any>): Promise<RelationalRawResult> {
    const ctx = new SqliteFormatContext();
    const query = sqliteFormatter.format(sql, ctx);
    return this.execRaw(query, ctx.getValues());
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    this.logger.debug('execute sql', { sql, queryValues: values });
    const statement = this.db.prepare(sql);
    if (!sql.toLowerCase().startsWith('select')) {
      const result = statement.run(values);
      return {
        rowCount: result.changes,
        rows: [],
      };
    } else {
      const result = statement.all(values);
      return {
        rows: result.map((row) => {
          const columnKeys = Object.keys(row);
          for (const columnKey of columnKeys) {
            const columnValue = row[columnKey];
            if (typeof columnValue === 'string' && columnValue.startsWith('JSON-')) {
              row[columnKey] = parseJson(columnValue.substr('JSON-'.length));
            } else if (
              typeof columnValue === 'string' &&
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}(Z){0,1}$/.test(columnValue)
            ) {
              row[columnKey] = new Date(columnValue);
            } else if (typeof columnValue === 'string' && columnValue.startsWith('BOOL-')) {
              row[columnKey] = columnValue.substr('BOOL-'.length) === 'true';
            }
            //TODO improve and document, make tests with text values BOOL-, JSON-, DATE- and wrong formats
          }
          return row;
        }),
        rowCount: result.length,
      };
    }
  }

  supportsQuery(sql: any): boolean {
    return sqliteFormatter.canHandle(sql);
  }

  async close(): Promise<void> {
    this.db.close();
  }

  toString() {
    return this.connectionString === ':memory:' ? 'sqlite-memory' : 'sqlite-file';
  }

  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    await this.storage.initialize();
    await this.transaction((trx) => {
      const sqls = this.applyMigrationPlan(migrationPlan);
      for (const sql of sqls) {
        trx.exec(sql);
      }
      this.storage.add(trx, schema, migrationPlan.migration);
    });
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    await this.storage.initialize();
    return this.storage.get(schema);
  }

  async transaction(action: (adapter: RelationalTransactionAdapter<SqliteSql>) => void): Promise<void> {
    this.db
      .transaction(() => {
        action(new SqliteRelationalTransactionAdapter(this.db));
      })
      .exclusive();
  }

  private applyMigrationPlan(migrationPlan: MigrationPlan): SqliteSql[] {
    const result: SqliteSql[] = [];
    for (const migrationPlanStep of migrationPlan.steps) {
      const step = migrationPlanStep.migrationStep;
      if (step.kind === 'add_table') {
        result.push(addTableAction(step, migrationPlan.migration));
      } else if (step.kind === 'add_table_field') {
        if (hasAddTableStep(migrationPlan.migration, step)) {
          continue;
        }

        result.push(addTableFieldAction(step));
      } else if (step.kind === 'add_table_primary_key') {
        if (hasAddTableStep(migrationPlan.migration, step)) {
          continue;
        }

        const targetTable = getTableFromSchema(migrationPlanStep.schema, table(step.table, step.schema));
        result.push(...migrateTableAction(migrationPlanStep.schema, targetTable.table));
      } else if (step.kind === 'add_table_foreign_key') {
        if (hasAddTableStep(migrationPlan.migration, step)) {
          continue;
        }

        const targetTable = getTableFromSchema(migrationPlanStep.schema, table(step.table, step.schema));
        result.push(...migrateTableAction(migrationPlanStep.schema, targetTable.table));
      } else if (step.kind === 'drop_table_primary_key') {
        const targetTable = getTableFromSchema(migrationPlanStep.schema, table(step.table, step.schema));
        result.push(...migrateTableAction(migrationPlanStep.schema, targetTable.table));
      } else if (step.kind === 'drop_table') {
        result.push(dropTableAction(step));
      } else if (step.kind === 'drop_table_field') {
        result.push(dropTableFieldAction(step));
      } else if (step.kind === 'create_index') {
        result.push(createIndexAction(step));
      } else if (step.kind === 'drop_index') {
        result.push(dropIndexAction({ kind: 'drop_index', name: step.name, table: step.table }));
      } else if (step.kind === 'drop_table_foreign_key') {
        const targetTable = getTableFromSchema(migrationPlanStep.schema, table(step.table, step.schema));
        result.push(...migrateTableAction(migrationPlanStep.schema, targetTable.table));
      } else if (step.kind === 'add_rule') {
      } else if (step.kind === 'drop_rule') {
      } else if (step.kind === 'add_view') {
        result.push(addViewAction(step));
      } else if (step.kind === 'alter_view') {
        result.push(alterViewAction(step));
      } else if (step.kind === 'drop_view') {
        result.push(dropViewAction(step));
      } else if (step.kind === 'insert_seed') {
        result.push(insertSeedAction(step));
      } else if (step.kind === 'update_seed') {
        result.push(updateSeedAction(step));
      } else if (step.kind === 'delete_seed') {
        result.push(deleteSeedAction(step));
      } else if (step.kind === 'update_table_field_required') {
        throw new Error('update_table_field_required currently unsupported');
      } else {
        failNever(step, 'unknown migration step');
      }
    }
    return orderSqls(result);
  }
}
