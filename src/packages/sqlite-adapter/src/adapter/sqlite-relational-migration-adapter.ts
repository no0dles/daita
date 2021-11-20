import { RelationalMigrationAdapter } from '@daita/orm';
import { SqliteSql } from '../sql/sqlite-sql';
import { MigrationStorage } from '@daita/orm';
import { MigrationPlan } from '@daita/orm';
import { failNever } from '@daita/common';
import { MigrationDescription } from '@daita/orm';
import { RelationalClient } from '@daita/relational';
import { SqliteRelationalTransactionAdapter } from './sqlite-relational-transaction-adapter';
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
import { Client } from '@daita/relational';
import { dropTableFieldAction } from '../orm/drop-table-field.action';
import { dropTableForeignKeyAction } from '../orm/drop-table-foreign-key.action';
import { RelationalTransactionClient } from '@daita/relational';

export class SqliteRelationalMigrationAdapter
  extends SqliteRelationalTransactionAdapter
  implements RelationalMigrationAdapter<SqliteSql> {

  private storage = new MigrationStorage({
    idType: { type: 'string' },
    transactionClient: new RelationalTransactionClient(this),
  });

  toString() {
    return this.connectionString.instant() === ':memory:' ? 'sqlite-memory' : 'sqlite-file';
  }

  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    await this.transaction(async (trx) => {
      const client = new RelationalClient(trx);
      await this.applyMigrationPlan(client, migrationPlan);
      await this.storage.add(client, schema, migrationPlan.migration);
    });
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    return this.storage.get(schema);
  }

  private async applyMigrationPlan(client: Client<SqliteSql>, migrationPlan: MigrationPlan) {
    for (const step of migrationPlan.migration.steps) {
      if (step.kind === 'add_table') {
        await addTableAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_field') {
        await addTableFieldAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_primary_key') {
        await addTablePrimaryKeyAction(client, step, migrationPlan.migration);
      } else if (step.kind === 'add_table_foreign_key') {
        // TODO await addTableForeignKeyAction(client, step);
      } else if (step.kind === 'drop_table_primary_key') {
        // TODO await dropTablePrimaryKeyAction(client, step);
      } else if (step.kind === 'drop_table') {
        await dropTableAction(client, step);
      } else if (step.kind === 'drop_table_field') {
        await dropTableFieldAction(client, step, migrationPlan.targetSchema);
      } else if (step.kind === 'create_index') {
        await createIndexAction(client, step);
      } else if (step.kind === 'drop_index') {
        await dropIndexAction(client, step);
      } else if (step.kind === 'drop_table_foreign_key') {
        await dropTableForeignKeyAction(client, step, migrationPlan.targetSchema);
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
