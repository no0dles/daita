import {BaseMigrationStep} from './base-migration-step';

export class AddCollectionMigrationStep implements BaseMigrationStep {
  kind = "add_collection";

  constructor(public collection: string) {}
}
