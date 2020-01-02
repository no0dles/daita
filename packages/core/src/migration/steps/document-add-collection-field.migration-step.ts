import {DocumentCollectionSchemaCollectionFieldType} from '../../schema';
import {BaseMigrationStep} from './base-migration-step';

export class AddCollectionFieldMigrationStep implements BaseMigrationStep {
  kind = 'add_collection_field';

  constructor(
    public collection: string,
    public fieldName: string,
    public type: DocumentCollectionSchemaCollectionFieldType,
    public required: boolean = false,
    public defaultValue: any = null,
  ) {
  }
}
