import { BaseMigrationStep } from './base-migration-step';

export class ModifyCollectionFieldMigrationStep implements BaseMigrationStep {
  kind = 'modify_collection_field';

  constructor(
    public collection: string,
    public fieldName: string,
    public required: boolean,
    public defaultValue: any,
  ) {}
}
