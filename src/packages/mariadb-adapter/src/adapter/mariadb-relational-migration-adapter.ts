import { RelationalMigrationAdapter } from '@daita/orm/adapter/relational-migration-adapter';
import { MariadbSql } from '../sql/mariadb-sql';
import { MigrationStorage } from '@daita/orm/migration/schema/migration-storage';
import { MigrationPlan } from '@daita/orm/context/relational-migration-context';
import { MigrationDescription } from '@daita/orm/migration/migration-description';
import { RelationalClient } from '@daita/relational/client/relational-client';
import { MariadbRelationalTransactionAdapter } from './mariadb-relational-transaction-adapter';
import { addTableWithSchemaAction } from '@daita/orm/migration/steps/add-table/relational-add-table.action';
import { addTableFieldAction } from '@daita/orm/migration/steps/add-table-field/relational-add-table-field.action';
import { addTablePrimaryKeyAction } from '@daita/orm/migration/steps/add-table-primary-key/relational-add-table-primary-key.action';
import { addTableForeignKeyAction } from '@daita/orm/migration/steps/add-table-foreign-key/relational-add-table-foreign-key.action';
import { dropTablePrimaryKeyAction } from '@daita/orm/migration/steps/drop-table-primary-key/relational-drop-table-primary-key.action';
import { dropTableAction } from '@daita/orm/migration/steps/drop-table/relational-drop-table.action';
import { dropTableField } from '@daita/orm/migration/steps/drop-table-field/relational-drop-table-field.action';
import { createIndexAction } from '@daita/orm/migration/steps/create-index/relational-create-index.action';
import { dropIndexAction } from '@daita/orm/migration/steps/drop-index/relational-drop-index.action';
import { dropTableForeignKeyAction } from '@daita/orm/migration/steps/drop-table-foreign-key/relational-drop-table-foreign-key.action';
import { addViewAction } from '@daita/orm/migration/steps/add-view/relational-add-view.action';
import { alterViewAction } from '@daita/orm/migration/steps/alter-view/relational-alter-view.action';
import { dropViewAction } from '@daita/orm/migration/steps/drop-view/relational-drop-view.action';
import { insertSeedAction } from '@daita/orm/migration/steps/insert-seed/relational-insert-seed.action';
import { updateSeedAction } from '@daita/orm/migration/steps/update-seed/relational-update-seed.action';
import { deleteSeedAction } from '@daita/orm/migration/steps/delete-seed/relational-delete-seed.action';
import { failNever } from '@daita/common/utils/fail-never';
import { Client } from '@daita/relational/client/client';
import { RelationalTransactionClient } from '@daita/relational/client/relational-transaction-client';

export class MariadbRelationalMigrationAdapter
  extends MariadbRelationalTransactionAdapter
  implements RelationalMigrationAdapter<MariadbSql> {
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
