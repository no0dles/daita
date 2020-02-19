import {MigrationStep} from '@daita/core';

export function generateStep(migrationStep: MigrationStep): string {
  if(migrationStep.kind === 'add_collection') {
    return '';
  } else if(migrationStep.kind === 'add_table_foreign_key') {
    return '';
  } else if(migrationStep.kind === 'add_table_primary_key') {
    return '';
  } else if(migrationStep.kind === 'add_table_field') {
    return '';
  } else if(migrationStep.kind === 'add_table') {
    return '';
  } else if(migrationStep.kind === 'drop_table') {
    return '';
  } else if(migrationStep.kind === 'modify_collection_field') {
    return '';
  } else if(migrationStep.kind === 'drop_collection_field') {
    return '';
  } else if(migrationStep.kind === 'drop_collection') {
    return '';
  } else if(migrationStep.kind === 'rename_collection_field') {
    return '';
  } else if(migrationStep.kind === 'add_collection_field') {
    return '';
  }
}