import {getIdentifierName, isKind} from '../migration/generation/utils';
import * as ts from 'typescript';
import {AstClassDeclaration} from './ast-class-declaration';
import {AstSourceFile} from './ast-source-file';
import {AstObjectValue} from './ast-object-value';
import {AstVariable} from './ast-variable';

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
      return new AstObjectValue(this.sourceFile, objectLiteral);
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

  get classDeclaration(): AstClassDeclaration | null {
    const classIdentifier = isKind(
      this.expression,
      ts.SyntaxKind.Identifier,
    );
    if (classIdentifier) {
      return this.sourceFile.getClassDeclaration(classIdentifier.text, {includeImport: true});
    }

    return null;
  }
}