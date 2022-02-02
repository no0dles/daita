import { SqliteSql } from '../sql/sqlite-sql';
import { MigrationStorage, RelationalOrmAdapter } from '@daita/orm';
import { MigrationPlan } from '@daita/orm';
import { createLogger, failNever, handleTimeout, parseJson } from '@daita/common';
import { MigrationDescription } from '@daita/orm';
import { addTableAction } from '@daita/orm';
import { addTableFieldAction } from '@daita/orm';
import { addTablePrimaryKeyAction } from '@daita/orm';
import { dropTableAction } from '@daita/orm';
import { createIndexAction } from '@daita/orm';
import { dropIndexAction } from '@daita/orm';
import { addViewAction } from '@daita/orm';
import { alterViewAction } from '@daita/orm';
import { dropViewAction } from '@daita/orm';
import { insertSeedAction } from '@daita/orm';
import { updateSeedAction } from '@daita/orm';
import { deleteSeedAction } from '@daita/orm';
import { dropTableFieldAction } from '../orm/drop-table-field.action';
import { dropTableForeignKeyAction } from '../orm/drop-table-foreign-key.action';
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
  UpdateSql,
} from '@daita/relational';
import { SqliteFormatContext, sqliteFormatter } from '../formatter';

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
    await this.transaction(async (trx) => {
      await this.applyMigrationPlan(trx, migrationPlan);
      await this.storage.add(trx, schema, migrationPlan.migration);
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

  private applyMigrationPlan(client: RelationalTransactionAdapter<SqliteSql>, migrationPlan: MigrationPlan) {
    for (const step of migrationPlan.migration.steps) {
      if (step.kind === 'add_table') {
        addTableAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_field') {
        addTableFieldAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_primary_key') {
        addTablePrimaryKeyAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_foreign_key') {
        // TODO await addTableForeignKeyAction(client, step);
      } else if (step.kind === 'drop_table_primary_key') {
        // TODO await dropTablePrimaryKeyAction(client, step);
      } else if (step.kind === 'drop_table') {
        dropTableAction(client, step);
      } else if (step.kind === 'drop_table_field') {
        dropTableFieldAction(client, step, migrationPlan.targetSchema);
      } else if (step.kind === 'create_index') {
        createIndexAction(client, step);
      } else if (step.kind === 'drop_index') {
        dropIndexAction(client, step);
      } else if (step.kind === 'drop_table_foreign_key') {
        dropTableForeignKeyAction(client, step, migrationPlan.targetSchema);
      } else if (step.kind === 'add_rule') {
      } else if (step.kind === 'drop_rule') {
      } else if (step.kind === 'add_view') {
        addViewAction(client, step);
      } else if (step.kind === 'alter_view') {
        alterViewAction(client, step);
      } else if (step.kind === 'drop_view') {
        dropViewAction(client, step);
      } else if (step.kind === 'insert_seed') {
        insertSeedAction(client, step);
      } else if (step.kind === 'update_seed') {
        updateSeedAction(client, step);
      } else if (step.kind === 'delete_seed') {
        deleteSeedAction(client, step);
      } else {
        failNever(step, 'unknown migration step');
      }
    }
  }
}
