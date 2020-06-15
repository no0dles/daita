import {RelationalAddTableMigrationStep} from './steps/relational-add-table.migration-step';
import {RelationalAddTableFieldMigrationStep} from './steps/relational-add-table-field.migration-step';
import {RelationalDropTableMigrationStep} from './steps/relational-drop-table.migration-step';
import {RelationalAddTablePrimaryKey} from './steps/relational-add-table-primary-key.migration-step';
import {RelationalAddTableForeignKey} from './steps/relational-add-table-foreign-key.migration-step';
import {RelationalDropTableFieldMigrationStep} from './steps/relational-drop-table-field.migration-step';

export type MigrationStep =
  | RelationalAddTableMigrationStep
  | RelationalAddTableFieldMigrationStep
  | RelationalDropTableMigrationStep
  | RelationalAddTablePrimaryKey
  | RelationalAddTableForeignKey
  | RelationalDropTableFieldMigrationStep;