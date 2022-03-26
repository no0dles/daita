import { MariadbSql } from '../sql/mariadb-sql';
import { addTableAction, hasAddTableStep, MigrationStorage, RelationalOrmAdapter } from '@daita/orm';
import { MigrationPlan } from '@daita/orm';
import { MigrationDescription } from '@daita/orm';
import {
  BaseRelationalAdapter,
  RelationalAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
  RelationDoesNotExistsError,
} from '@daita/relational';
import { addTableFieldAction } from '@daita/orm';
import { addTablePrimaryKeyAction } from '@daita/orm';
import { addTableForeignKeyAction } from '@daita/orm';
import { dropTablePrimaryKeyAction } from '@daita/orm';
import { dropTableAction } from '@daita/orm';
import { dropTableField } from '@daita/orm';
import { createIndexAction } from '@daita/orm';
import { dropIndexAction } from '@daita/orm';
import { dropTableForeignKeyAction } from '@daita/orm';
import { addViewAction } from '@daita/orm';
import { alterViewAction } from '@daita/orm';
import { dropViewAction } from '@daita/orm';
import { insertSeedAction } from '@daita/orm';
import { updateSeedAction } from '@daita/orm';
import { deleteSeedAction } from '@daita/orm';
import { failNever, parseJson } from '@daita/common';
import { Execution, MariadbRelationalDataAdapter } from './mariadb-relational-data-adapter';
import { MariadbFormatContext, mariadbFormatter } from '../formatter';
import { Connection, createPool, Pool } from 'mariadb';

export interface MariadbRelationalMigrationAdapterOptions {
  connectionString: string;
}

export class MariadbRelationalMigrationAdapter
  extends BaseRelationalAdapter
  implements RelationalOrmAdapter, RelationalAdapter<MariadbSql>
{
  private readonly storage = new MigrationStorage(this, {
    idType: { type: 'string', size: 255 },
  });
  private readonly pool: Pool;

  constructor(private options: MariadbRelationalMigrationAdapterOptions) {
    super();
    this.pool = createPool(this.options.connectionString);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const connection = await this.pool.getConnection();
    try {
      return await this.run(connection, { sql, values });
    } finally {
      await connection.release();
    }
  }

  exec(sql: MariadbSql): Promise<RelationalRawResult> {
    const ctx = new MariadbFormatContext();
    const query = mariadbFormatter.format(sql, ctx);
    return this.execRaw(query, ctx.getValues());
  }

  supportsQuery<S>(sql: S): this is RelationalAdapter<MariadbSql | S> {
    return mariadbFormatter.canHandle(sql);
  }

  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    await this.storage.initialize();
    await this.transaction(async (trx) => {
      const sqls = this.applyMigrationPlan(migrationPlan);
      for (const sql of sqls) {
        trx.exec(sql);
      }
      this.storage.add(trx, schema, migrationPlan.migration);
    });
  }

  async transaction(action: (adapter: RelationalTransactionAdapter<MariadbSql>) => void): Promise<void> {
    const adapter = new MariadbRelationalDataAdapter();
    action(adapter);

    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const execution of adapter.executions) {
        await this.run(connection, execution);
      }
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      await connection.release();
    }
  }

  private async run(connection: Connection, execution: Execution): Promise<RelationalRawResult> {
    try {
      const result = await connection.query(
        {
          sql: execution.sql,
          typeCast: (column, next) => {
            if (column.type == 'TINY' && column.columnLength === 1) {
              const val = column.int();
              return val === null ? null : val === 1;
            } else if (column.columnType === 252) {
              const val = column.string();
              if (!val) {
                return val;
              }
              return parseJson(val);
            }
            return next();
          },
        },
        execution.values,
      );
      return {
        rows: result instanceof Array ? [...result] : [],
        rowCount: result instanceof Array ? result.length : result.affectedRows,
      };
    } catch (e: any) {
      if (e.errno === 1146) {
        const regex1 = /Table '(?<schema>[^.]+)\.(?<relation>[^']*?)' doesn't exist/g;
        const match1 = regex1.exec(e.message);
        const groups1 = match1?.groups || {};
        if (groups1.schema && groups1.relation) {
          throw new RelationDoesNotExistsError(e, execution.sql, execution.values, groups1.schema, groups1.relation);
        } else {
          const regex2 = /Table '(?<relation>[^']*?)' doesn't exist/g;
          const match2 = regex2.exec(e.message);
          const groups2 = match2?.groups || {};
          if (groups2.relation) {
            throw new RelationDoesNotExistsError(e, execution.sql, execution.values, undefined, groups2.relation);
          }
        }
      }
      throw e;
    }
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    return this.storage.get(schema);
  }

  private applyMigrationPlan(migrationPlan: MigrationPlan): MariadbSql[] {
    const result: MariadbSql[] = [];

    for (const step of migrationPlan.migration.steps) {
      if (step.kind === 'add_table') {
        result.push(addTableAction(step, migrationPlan.migration));
      } else if (step.kind === 'add_table_field') {
        result.push(addTableFieldAction(step));
      } else if (step.kind === 'add_table_primary_key') {
        if (hasAddTableStep(migrationPlan.migration, step)) {
          continue;
        }

        result.push(addTablePrimaryKeyAction(step));
      } else if (step.kind === 'add_table_foreign_key') {
        if (hasAddTableStep(migrationPlan.migration, step)) {
          continue;
        }

        result.push(addTableForeignKeyAction(step));
      } else if (step.kind === 'drop_table_primary_key') {
        result.push(dropTablePrimaryKeyAction(step));
      } else if (step.kind === 'drop_table') {
        result.push(dropTableAction(step));
      } else if (step.kind === 'drop_table_field') {
        result.push(dropTableField(step));
      } else if (step.kind === 'create_index') {
        result.push(createIndexAction(step));
      } else if (step.kind === 'drop_index') {
        result.push(dropIndexAction(step));
      } else if (step.kind === 'drop_table_foreign_key') {
        result.push(dropTableForeignKeyAction(step));
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
      } else {
        failNever(step, 'unknown migration step');
      }
    }

    return result;
  }
}
