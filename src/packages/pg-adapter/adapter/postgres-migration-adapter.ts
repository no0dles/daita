import { RelationalMigrationAdapter } from '../../orm/adapter/relational-migration-adapter';
import { PostgresSql } from '../sql/postgres-sql';
import { MigrationDescription } from '../../orm/migration/migration-description';
import { table } from '../../relational/sql/keyword/table/table';
import { failNever } from '../../common/utils/fail-never';
import { PostgresTransactionAdapter } from './postgres-transaction-adapter';
import { MigrationPlan } from '../../orm/context/relational-migration-context';
import { MigrationStorage } from '../../orm/migration/schema/migration-storage';
import { Resolvable } from '../../common/utils/resolvable';
import { RelationalClient } from '../../relational/client/relational-client';
import { Migrations } from '../../orm/migration/schema/migrations';
import { updateSeedAction } from '../../orm/migration/steps/update-seed/relational-update-seed.action';
import { insertSeedAction } from '../../orm/migration/steps/insert-seed/relational-insert-seed.action';
import { deleteSeedAction } from '../../orm/migration/steps/delete-seed/relational-delete-seed.action';
import { dropViewAction } from '../../orm/migration/steps/drop-view/relational-drop-view.action';
import { dropTableAction } from '../../orm/migration/steps/drop-table/relational-drop-table.action';
import { addViewAction } from '../../orm/migration/steps/add-view/relational-add-view.action';
import { dropTableField } from '../../orm/migration/steps/drop-table-field/relational-drop-table-field.action';
import { addTableWithSchemaAction } from '../../orm/migration/steps/add-table/relational-add-table.action';
import { addTableFieldAction } from '../../orm/migration/steps/add-table-field/relational-add-table-field.action';
import { createIndexAction } from '../../orm/migration/steps/create-index/relational-create-index.action';
import { alterViewAction } from '../../orm/migration/steps/alter-view/relational-alter-view.action';
import { addTablePrimaryKeyAction } from '../../orm/migration/steps/add-table-primary-key/relational-add-table-primary-key.action';
import { dropIndexAction } from '../../orm/migration/steps/drop-index/relational-drop-index.action';
import { dropTableForeignKeyAction } from '../../orm/migration/steps/drop-table-foreign-key/relational-drop-table-foreign-key.action';
import { addTableForeignKeyAction } from '../../orm/migration/steps/add-table-foreign-key/relational-add-table-foreign-key.action';
import { dropTablePrimaryKeyAction } from '../../orm/migration/steps/drop-table-primary-key/relational-drop-table-primary-key.action';
import { Client } from '../../relational/client/client';
import { IwentAdapter } from '../../iwent/iwent-adapter';
import { Iwent } from 'packages/iwent/iwent';
import { IwentContract } from 'packages/iwent/iwent-contract';
import { ContractStorage } from '../../iwent/schema/contract-storage';
import { DaitaContract } from '../../iwent/schema/contract';
import { RelationalTransactionClient } from '../../relational/client/relational-transaction-client';
import { updateTableFieldRequiredAction } from './actions/update-table-field-required';

export class PostgresMigrationAdapter
  extends PostgresTransactionAdapter
  implements RelationalMigrationAdapter<PostgresSql>, IwentAdapter {
  private readonly migrationStorage = new MigrationStorage({
    idType: { type: 'string' },
    transactionClient: new RelationalTransactionClient(this),
  });
  private readonly contractStorage = new ContractStorage({
    idType: { type: 'string' },
    transactionClient: new RelationalTransactionClient(this),
  });

  constructor(connectionString: Resolvable<string>) {
    super(connectionString);
  }

  addEvent(event: Iwent): Promise<void> {
    return this.contractStorage.addEvent(event);
  }

  async getEvent(id: string): Promise<Iwent | null> {
    return this.contractStorage.getEvent(id);
  }

  async applyContract(contract: IwentContract): Promise<void> {
    await this.transaction(async (trx) => {
      const client = new RelationalClient(trx);
      await client.exec({ lockTable: table(DaitaContract) });
      await this.contractStorage.addContract(client, contract);
      await client.exec({ notify: 'daita_contracts' });
    });
  }

  async getContracts(): Promise<IwentContract[]> {
    return this.contractStorage.getContract();
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    return this.migrationStorage.get(schema);
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
      } else if (step.kind === 'update_table_field_required') {
        await updateTableFieldRequiredAction(client, step);
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
