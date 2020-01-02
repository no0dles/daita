import {BaseMigrationStep} from './base-migration-step';

export class DropCollectionMigrationStep implements BaseMigrationStep {
  kind = "drop_collection";

  constructor(public collection: string) {}
}
