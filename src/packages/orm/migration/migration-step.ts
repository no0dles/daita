import { RelationalAddTableMigrationStep } from './steps/relational-add-table.migration-step';
import { RelationalAddTableFieldMigrationStep } from './steps/relational-add-table-field.migration-step';
import { RelationalDropTableMigrationStep } from './steps/relational-drop-table.migration-step';
import { RelationalAddTablePrimaryKey } from './steps/relational-add-table-primary-key.migration-step';
import { RelationalAddTableForeignKey } from './steps/relational-add-table-foreign-key.migration-step';
import { RelationalDropTableFieldMigrationStep } from './steps/relational-drop-table-field.migration-step';
import { RelationalDropTablePrimaryKeyMigrationStep } from './steps/relational-drop-table-primary-key.migration-step';
import { RelationalDropViewMigrationStep } from './steps/relational-drop-view.migration-step';
import { RelationalCreateIndexMigrationStep } from './steps/relational-create-index.migration-step';
import { RelationalInsertSeedMigrationStep } from './steps/relational-insert-seed.migration-step';
import { RelationalAlterViewMigrationStep } from './steps/relational-alter-view.migration-step';
import { RelationalAddRuleMigrationStep } from './steps/relational-add-rule.migration-step';
import { RelationalDropIndexMigrationStep } from './steps/relational-drop-index.migration-step';
import { RelationalUpdateSeedMigrationStep } from './steps/relational-update-seed.migration-step';
import { RelationalDropTableForeignKeyMigrationStep } from './steps/relational-drop-table-foreign-key.migration-step';
import { RelationalAddViewMigrationStep } from './steps/relational-add-view.migration-step';
import { RelationalDeleteSeedMigrationStep } from './steps/relational-delete-seed.migration-step';
import { RelationalDropRuleMigrationStep } from './steps/relational-drop-rule.migration-step';

export type MigrationStep =
  | RelationalAddTableMigrationStep
  | RelationalAddTableFieldMigrationStep
  | RelationalDropTableMigrationStep
  | RelationalAddTablePrimaryKey
  | RelationalAddTableForeignKey
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
