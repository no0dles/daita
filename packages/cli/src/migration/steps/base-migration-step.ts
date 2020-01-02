import * as ts from 'typescript';
import {BaseMigrationStep} from '@daita/core/dist/migration/steps/base-migration-step';

export interface ExtendedMigrationStep extends BaseMigrationStep {
  toNode(): ts.NewExpression;
}
