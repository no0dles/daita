import { RelationalMigrationAdapter } from '../../orm/adapter/relational-migration-adapter';
import { SqliteSql } from '../sql/sqlite-sql';
import { MigrationStorage } from '../../orm/migration/schema/migration-storage';
import { MigrationPlan } from '../../orm/context/relational-migration-context';
import { failNever } from '../../common/utils/fail-never';
import { MigrationDescription } from '../../orm/migration/migration-description';
import { RelationalClient } from '../../relational/client/relational-client';
import { SqliteRelationalTransactionAdapter } from './sqlite-relational-transaction-adapter';
import {
  addTableAction,
  addTableWithSchemaAction,
} from '../../orm/migration/steps/add-table/relational-add-table.action';
import { addTableFieldAction } from '../../orm/migration/steps/add-table-field/relational-add-table-field.action';
import { addTablePrimaryKeyAction } from '../../orm/migration/steps/add-table-primary-key/relational-add-table-primary-key.action';
import { dropTableAction } from '../../orm/migration/steps/drop-table/relational-drop-table.action';
import { createIndexAction } from '../../orm/migration/steps/create-index/relational-create-index.action';
import { dropIndexAction } from '../../orm/migration/steps/drop-index/relational-drop-index.action';
import { addViewAction } from '../../orm/migration/steps/add-view/relational-add-view.action';
import { alterViewAction } from '../../orm/migration/steps/alter-view/relational-alter-view.action';
import { dropViewAction } from '../../orm/migration/steps/drop-view/relational-drop-view.action';
import { insertSeedAction } from '../../orm/migration/steps/insert-seed/relational-insert-seed.action';
import { updateSeedAction } from '../../orm/migration/steps/update-seed/relational-update-seed.action';
import { deleteSeedAction } from '../../orm/migration/steps/delete-seed/relational-delete-seed.action';
import { Client } from '../../relational/client/client';
import { dropTableFieldAction } from '../orm/drop-table-field.action';
import { dropTableForeignKeyAction } from '../orm/drop-table-foreign-key.action';

export class SqliteRelationalMigrationAdapter
  extends SqliteRelationalTransactionAdapter
  implements RelationalMigrationAdapter<SqliteSql> {
  private storage = new MigrationStorage();

  toString() {
    return this.connectionString.instant() === ':memory:' ? 'sqlite-memory' : 'sqlite-file';
  }

  async applyMigration(schema: string, migrationPlans: MigrationPlan[]): Promise<void> {
    await this.transaction(async (trx) => {
      const client = new RelationalClient(trx);

      for (const migrationPlan of migrationPlans) {
        await this.applyMigrationPlan(client, migrationPlan);
        await this.storage.add(client, schema, migrationPlan.migration);
      }
    });
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    if (!this.storage.hasInitialized()) {
      await this.transaction(async (trx) => {
        await this.storage.initalize(new RelationalClient(trx));
      });
    }
    return this.storage.get(new RelationalClient(this), schema);
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
        // TODOawait addTableForeignKeyAction(client, step);
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
