import * as ts from 'typescript';
import {AstClassDeclaration} from './ast-class-declaration';
import {AstSourceFile} from './ast-source-file';
import {AstObjectValue} from './ast-object-value';
import {AstVariable} from './ast-variable';
import {getIdentifierName, isKind} from './utils';

export class AstVariableCallArgument {


  constructor(private sourceFile: AstSourceFile,
              private expression: ts.Expression,
              public index: number) {
  }

  get objectValue(): AstObjectValue | null {
    const objectLiteral = isKind(
      this.expression,
      ts.SyntaxKind.ObjectLiteralExpression,
    );
    if (objectLiteral) {
      return new AstObjectValue(objectLiteral);
    }
    return null;
  }

  get variable(): AstVariable | null {

    const identifier = isKind(
      this.expression,
      ts.SyntaxKind.Identifier,
    );
    if (identifier) {
      return this.sourceFile.getVariable(getIdentifierName(identifier), {includeImported: true});
    }

    return null;
  }

  get className(): string | null {
    const classIdentifier = isKind(
      this.expression,
      ts.SyntaxKind.Identifier,
    );
    if (classIdentifier) {
      return classIdentifier.text;
    }
    return null;
  }

  get classDeclaration(): AstClassDeclaration | null {
    const className = this.className;
    if (className) {
      return this.sourceFile.getClassDeclaration(className, {includeImport: true});
    }

    return null;
  }
}