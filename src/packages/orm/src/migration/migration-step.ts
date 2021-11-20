import { RelationalAddTableMigrationStep } from './steps/add-table/relational-add-table.migration-step';
import { RelationalAddTableFieldMigrationStep } from './steps/add-table-field/relational-add-table-field.migration-step';
import { RelationalDropTableMigrationStep } from './steps/drop-table/relational-drop-table.migration-step';
import { RelationalAddTablePrimaryKey } from './steps/add-table-primary-key/relational-add-table-primary-key.migration-step';
import { RelationalAddTableForeignKeyMigrationStep } from './steps/add-table-foreign-key/relational-add-table-foreign-key.migration-step';
import { RelationalDropTableFieldMigrationStep } from './steps/drop-table-field/relational-drop-table-field.migration-step';
import { RelationalDropTablePrimaryKeyMigrationStep } from './steps/drop-table-primary-key/relational-drop-table-primary-key.migration-step';
import { RelationalDropViewMigrationStep } from './steps/drop-view/relational-drop-view.migration-step';
import { RelationalCreateIndexMigrationStep } from './steps/create-index/relational-create-index.migration-step';
import { RelationalInsertSeedMigrationStep } from './steps/insert-seed/relational-insert-seed.migration-step';
import { RelationalAlterViewMigrationStep } from './steps/alter-view/relational-alter-view.migration-step';
import { RelationalAddRuleMigrationStep } from './steps/add-rule/relational-add-rule.migration-step';
import { RelationalDropIndexMigrationStep } from './steps/drop-index/relational-drop-index.migration-step';
import { RelationalUpdateSeedMigrationStep } from './steps/update-seed/relational-update-seed.migration-step';
import { RelationalDropTableForeignKeyMigrationStep } from './steps/drop-table-foreign-key/relational-drop-table-foreign-key.migration-step';
import { RelationalAddViewMigrationStep } from './steps/add-view/relational-add-view.migration-step';
import { RelationalDeleteSeedMigrationStep } from './steps/delete-seed/relational-delete-seed.migration-step';
import { RelationalDropRuleMigrationStep } from './steps/drop-rule/relational-drop-rule.migration-step';

export type MigrationStep =
  | RelationalAddTableMigrationStep
  | RelationalAddTableFieldMigrationStep
  | RelationalDropTableMigrationStep
  | RelationalAddTablePrimaryKey
  | RelationalAddTableForeignKeyMigrationStep
  | RelationalDropTableFieldMigrationStep
  | RelationalCreateIndexMigrationStep
  | RelationalDropIndexMigrationStep
  | RelationalAddRuleMigrationStep
  | RelationalDropRuleMigrationStep
  | RelationalDropTableForeignKeyMigrationStep
  | RelationalAddViewMigrationStep
  | RelationalDropViewMigrationStep
  | RelationalAlterViewMigrationStep
  | RelationalInsertSeedMigrationStep
  | RelationalUpdateSeedMigrationStep
  | RelationalDeleteSeedMigrationStep
  | RelationalDropTablePrimaryKeyMigrationStep;
