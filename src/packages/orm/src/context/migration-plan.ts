import { MigrationDescription } from '../migration';
import { MigrationDirection } from '../adapter';
import { SchemaDescription } from '../schema';

export interface MigrationPlan {
  migration: MigrationDescription;
  direction: MigrationDirection;
  targetSchema: SchemaDescription;
}
