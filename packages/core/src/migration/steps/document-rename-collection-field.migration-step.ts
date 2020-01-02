import {BaseMigrationStep} from './base-migration-step';

export class RenameCollectionFieldMigrationStep implements BaseMigrationStep {
  kind = "rename_collection_field";

  constructor(
    public collection: string,
    public oldFieldName: string,
    public newFieldName: string
  ) {}
}
