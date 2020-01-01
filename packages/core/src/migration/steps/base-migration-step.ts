import * as ts from 'typescript';

export interface BaseMigrationStep {
  kind: string;
  toNode(): ts.NewExpression;
}
