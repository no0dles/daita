import { RelationalMigrationAdapter } from '@daita/orm';
import { PostgresSql } from '../sql/postgres-sql';
import { MigrationDescription } from '@daita/orm';
import { table } from '@daita/relational';
import { failNever } from '@daita/common';
import { PostgresTransactionAdapter } from './postgres-transaction-adapter';
import { MigrationPlan } from '@daita/orm';
import { MigrationStorage } from '@daita/orm';
import { Resolvable } from '@daita/common';
import { RelationalClient } from '@daita/relational';
import { Migrations } from '@daita/orm';
import { updateSeedAction } from '@daita/orm';
import { insertSeedAction } from '@daita/orm';
import { deleteSeedAction } from '@daita/orm';
import { dropViewAction } from '@daita/orm';
import { dropTableAction } from '@daita/orm';
import { addViewAction } from '@daita/orm';
import { dropTableField } from '@daita/orm';
import { addTableWithSchemaAction } from '@daita/orm';
import { addTableFieldAction } from '@daita/orm';
import { createIndexAction } from '@daita/orm';
import { alterViewAction } from '@daita/orm';
import { addTablePrimaryKeyAction } from '@daita/orm';
import { dropIndexAction } from '@daita/orm';
import { dropTableForeignKeyAction } from '@daita/orm';
import { addTableForeignKeyAction } from '@daita/orm';
import { dropTablePrimaryKeyAction } from '@daita/orm';
import { Client } from '@daita/relational';
import { RelationalTransactionClient } from '@daita/relational';
import { dropDatabase, ensureDatabaseExists } from '../postgres.util';

export class PostgresMigrationAdapter
  extends PostgresTransactionAdapter
  implements RelationalMigrationAdapter<PostgresSql>
{
  private readonly migrationStorage = new MigrationStorage({
    idType: { type: 'string' },
    transactionClient: new RelationalTransactionClient(this),
  });

  constructor(connectionString: Resolvable<string>) {
    super(connectionString);
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    return this.migrationStorage.get(schema);
  }

  async remove(): Promise<void> {
    const connectionString = await this.connectionString.get();
    await this.pool.close();
    await dropDatabase(connectionString);
    await ensureDatabaseExists(connectionString);
    await this.pool.reset();
  }

  private async applyMigrationPlan(client: Client<PostgresSql>, migrationPlan: MigrationPlan) {
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

  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    await this.transaction(async (trx) => {
      const client = new RelationalClient(trx);
      await client.exec({ lockTable: table(Migrations) });
      await this.applyMigrationPlan(client, migrationPlan);
      await this.migrationStorage.add(client, schema, migrationPlan.migration);
      await client.exec({ notify: 'daita_migrations' });
    });
  }

  toString() {
    return 'postgres';
  }
}
