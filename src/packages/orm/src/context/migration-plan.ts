import { MigrationDescription, MigrationStep } from '../migration';
import { MigrationDirection } from '../adapter';
import { SchemaDescription } from '../schema';

export interface MigrationPlan {
  migration: MigrationDescription;
  direction: MigrationDirection;
  targetSchema: SchemaDescription;
  steps: MigrationPlanStep[];
}

export interface MigrationPlanStep {
  migrationStep: MigrationStep;
  schema: SchemaDescription;
}
