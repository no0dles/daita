import { RelationalMigrationAdapter } from '@daita/orm';
import { MariadbSql } from '../sql/mariadb-sql';
import { MigrationStorage } from '@daita/orm';
import { MigrationPlan } from '@daita/orm';
import { MigrationDescription } from '@daita/orm';
import { RelationalClient } from '@daita/relational';
import { MariadbRelationalTransactionAdapter } from './mariadb-relational-transaction-adapter';
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
import { failNever } from '@daita/common';
import { Client } from '@daita/relational';
import { RelationalTransactionClient } from '@daita/relational';

export class MariadbRelationalMigrationAdapter
  extends MariadbRelationalTransactionAdapter
  implements RelationalMigrationAdapter<MariadbSql>
{
  private storage = new MigrationStorage({
    idType: { type: 'string', size: 255 },
    transactionClient: new RelationalTransactionClient(this),
  });

  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    await this.transaction(async (trx) => {
      const client = new RelationalClient(trx);
      await this.applyMigrationPlan(client, migrationPlan);
      await this.storage.add(client, schema, migrationPlan.migration);
    });
  }

  async remove(): Promise<void> {
    await this.pool.close();
    // TODO
    await this.pool.reset();
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
