import {assert} from 'chai';
import * as ts from 'typescript';
import {AddCollectionFieldMigrationStep} from './steps/document-add-collection-field.migration-step';

describe('steps', () => {
  it('AddCollectionFieldMigrationStep toNode()', () => {
    const step = new AddCollectionFieldMigrationStep('user', 'test', 'string', true, 'abc');
    const node = step.toNode();

    const sourceFile = ts.createSourceFile(`test.ts`, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    const printer = ts.createPrinter({
      newLine: ts.NewLineKind.LineFeed,
    });
    const content = printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
    assert.equal(content, 'new AddCollectionFieldMigrationStep("user", "test", "string", true, "abc")');
  });
});
