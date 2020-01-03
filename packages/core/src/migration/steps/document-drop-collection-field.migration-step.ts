import { BaseMigrationStep } from './base-migration-step';

export class DropCollectionFieldMigrationStep implements BaseMigrationStep {
  kind = 'drop_collection_field';

  constructor(public collection: string, public fieldName: string) {}
}
