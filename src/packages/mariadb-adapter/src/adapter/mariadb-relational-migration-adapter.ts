import { RelationalMigrationAdapter } from '@daita/orm';
import { MariadbSql } from '../sql/mariadb-sql';
import { MigrationStorage } from '@daita/orm';
import { MigrationPlan } from '@daita/orm';
import { MigrationDescription } from '@daita/orm';
import { RelationalClient, RelationalDataAdapter, RelationalRawResult } from '@daita/relational';
import { addTableWithSchemaAction } from '@daita/orm';
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
import { failNever, handleTimeout, Resolvable } from '@daita/common';
import { Client } from '@daita/relational';
import { RelationalTransactionClient } from '@daita/relational';
import { MariadbRelationalDataAdapter } from './mariadb-relational-data-adapter';
import { MariadbFormatContext, mariadbFormatter } from '../formatter';
import { Pool } from 'mariadb';

export interface MariadbRelationalMigrationAdapterOptions {
  connectionString: string;
}

export class MariadbRelationalMigrationAdapter implements RelationalMigrationAdapter<MariadbSql> {
  private readonly storage = new MigrationStorage({
    idType: { type: 'string', size: 255 },
    transactionClient: new RelationalTransactionClient(this),
  });
  private readonly pool: Promise<Pool>;

  constructor(private options: MariadbRelationalMigrationAdapterOptions) {
    this.pool = new Promise<Pool>((resolve) => {});
  }

  async close(): Promise<void> {
    const pool = await this.pool;
    await pool.end();
  }

  execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    throw new Error('Method not implemented.');
  }

  exec(sql: MariadbSql): Promise<RelationalRawResult> {
    const ctx = new MariadbFormatContext();
    const query = mariadbFormatter.format(sql, ctx);
    return this.execRaw(query, ctx.getValues());
  }

  supportsQuery<S>(sql: S): this is RelationalDataAdapter<MariadbSql | S> {
    return mariadbFormatter.canHandle(sql);
  }

  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    await this.transaction(async (trx) => {
      const client = new RelationalClient(trx);
      await this.applyMigrationPlan(client, migrationPlan);
      await this.storage.add(client, schema, migrationPlan.migration);
    });
  }

  async transaction<T>(
    action: (adapter: RelationalDataAdapter<MariadbSql>) => Promise<T>,
    timeout?: number,
  ): Promise<T> {
    const pool = await this.pool;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const adapter = new MariadbRelationalDataAdapter(connection);
      const result = await handleTimeout(() => action(adapter), timeout);
      await connection.commit();
      return result;
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  }

  async remove(): Promise<void> {
    // TODO
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    return this.storage.get(schema);
  }

  private async applyMigrationPlan(client: Client<MariadbSql>, migrationPlan: MigrationPlan) {
    for (const step of migrationPlan.migration.steps) {
      if (step.kind === 'add_table') {
        await addTableWithSchemaAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_field') {
        await addTableFieldAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_primary_key') {
        await addTablePrimaryKeyAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_foreign_key') {
        await addTableForeignKeyAction(client, step);
      } else if (step.kind === 'drop_table_primary_key') {
        await dropTablePrimaryKeyAction(client, step);
      } else if (step.kind === 'drop_table') {
        await dropTableAction(client, step);
      } else if (step.kind === 'drop_table_field') {
        await dropTableField(client, step);
      } else if (step.kind === 'create_index') {
        await createIndexAction(client, step);
      } else if (step.kind === 'drop_index') {
        await dropIndexAction(client, step);
      } else if (step.kind === 'drop_table_foreign_key') {
        await dropTableForeignKeyAction(client, step);
      } else if (step.kind === 'add_rule') {
      } else if (step.kind === 'drop_rule') {
      } else if (step.kind === 'add_view') {
        await addViewAction(client, step);
      } else if (step.kind === 'alter_view') {
        await alterViewAction(client, step);
      } else if (step.kind === 'drop_view') {
        await dropViewAction(client, step);
      } else if (step.kind === 'insert_seed') {
        await insertSeedAction(client, step);
      } else if (step.kind === 'update_seed') {
        await updateSeedAction(client, step);
      } else if (step.kind === 'delete_seed') {
        await deleteSeedAction(client, step);
      } else {
        failNever(step, 'unknown migration step');
      }
    }
  }
}
