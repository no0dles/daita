import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
  static FAILURE_STRING = "import statement from src is forbidden";

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoSrcImportWalker(sourceFile, this.getOptions())
    );
  }
}

// tslint:disable-next-line: max-classes-per-file
class NoSrcImportWalker extends Lint.RuleWalker {
  visitImportDeclaration(node: ts.ImportDeclaration) {
    if (node.moduleSpecifier.getFullText().indexOf("src") >= 0) {
      this.addFailureAt(
        node.moduleSpecifier.getStart(),
        node.moduleSpecifier.getWidth(),
        Rule.FAILURE_STRING
      );
    }

    super.visitImportDeclaration(node);
  }
}
