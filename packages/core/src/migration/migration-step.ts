import {AddCollectionFieldMigrationStep} from './steps/document-add-collection-field.migration-step';
import {AddCollectionMigrationStep} from './steps/document-add-collection.migration-step';
import {DropCollectionFieldMigrationStep} from './steps/document-drop-collection-field.migration-step';
import {DropCollectionMigrationStep} from './steps/document-drop-collection.migration-step';
import {ModifyCollectionFieldMigrationStep} from './steps/document-modify-collection-field.migration-step';
import {RenameCollectionFieldMigrationStep} from './steps/document-rename-collection-field.migration-step';
import {RelationalAddTableMigrationStep} from './steps/relational-add-table.migration-step';
import {RelationalAddTableFieldMigrationStep} from './steps/relational-add-table-field.migration-step';
import {RelationalDropTableMigrationStep} from './steps/relational-drop-table.migration-step';
import {RelationalAddTablePrimaryKey} from './steps/relational-add-table-primary-key.migration-step';
import {RelationalAddTableForeignKey} from './steps/relational-add-table-foreign-key.migration-step';
import {RelationalDropTableFieldMigrationStep} from './steps/relational-drop-table-field.migration-step';
import {RelationalAddPermissionMigrationStep, RelationalDropPermissionMigrationStep} from './steps';

export type MigrationStep =
  | AddCollectionFieldMigrationStep
  | AddCollectionMigrationStep
  | ModifyCollectionFieldMigrationStep
  | DropCollectionFieldMigrationStep
  | DropCollectionMigrationStep
  | RenameCollectionFieldMigrationStep
  | RelationalAddTableMigrationStep
  | RelationalAddTableFieldMigrationStep
  | RelationalDropTableMigrationStep
  | RelationalAddTablePrimaryKey
  | RelationalAddTableForeignKey
  | RelationalDropTableFieldMigrationStep
  | RelationalAddPermissionMigrationStep
  | RelationalDropPermissionMigrationStep;
