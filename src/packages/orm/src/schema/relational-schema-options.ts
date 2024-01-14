import { MigrationStrategy } from '../migration/migration-strategy';

export interface DefaultRelationalSchemaOptions<TSql> {
  name: string;
  schema?: string;
  backwardCompatible?: boolean;
}

export interface RelationalSchemaOptions<TSql> {
  name: string;
  schema?: string;
  backwardCompatible?: boolean;
  migrationStrategy: MigrationStrategy<TSql>;
}
