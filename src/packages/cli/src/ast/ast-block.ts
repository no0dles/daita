import { AstSourceFile } from './ast-source-file';
import { AstClassDeclaration } from './ast-class-declaration';
import { AstFunctionDeclaration } from './ast-function-declaration';
import { AstVariableDeclaration } from './ast-variable-declaration';
import { isKind } from '../ast/utils';
import { getName } from './utils';
import { AstValue } from './ast-value';
import { BlockLike, factory, Identifier, QualifiedName, SyntaxKind } from 'typescript';
import { AstType } from './ast-type';
import { AstEnumDeclaration } from './ast-enum-declaration';
import { AstExpressionStatement } from './ast-expression-statement';
import { AstTypeDeclaration } from './ast-type-declaration';
import { AstKeywordValue } from './ast-keyword-value';

export class AstBlock {
  constructor(public sourceFile: AstSourceFile, private block: BlockLike, private parentBlock: AstBlock | null) {}

  get classes(): Generator<AstClassDeclaration> {
    return this.getClasses();
  }

  get functions(): Generator<AstFunctionDeclaration> {
    return this.getFunctions();
  }

  get enums(): Generator<AstEnumDeclaration> {
    return this.getEnums();
  }

  get variables(): Generator<AstVariableDeclaration> {
    return this.getVariables();
  }

  get expressionStatements(): Generator<AstExpressionStatement> {
    return this.getExpressionStatements();
  }

  get types(): Generator<AstTypeDeclaration> {
    return this.getTypes();
  }

  type(name: string) {
    for (const typeDeclaration of this.types) {
      if (typeDeclaration.name === name) {
        return typeDeclaration;
      }
    }
    return null;
  }

  enum(name: string) {
    for (const enumDeclaration of this.enums) {
      if (enumDeclaration.name === name) {
        return enumDeclaration;
      }
    }
    return null;
  }

  variable(name: string) {
    for (const variableDeclaration of this.variables) {
      if (variableDeclaration.name === name) {
        return variableDeclaration;
      }
    }
    return null;
  }

  function(name: string) {
    for (const functionDeclaration of this.functions) {
      if (functionDeclaration.name === name) {
        return functionDeclaration;
      }
    }
    return null;
  }

  class(name: string) {
    for (const classDeclaration of this.classes) {
      if (classDeclaration.name === name) {
        return classDeclaration;
      }
    }
    for (const imp of this.sourceFile.imports) {
      const type = imp.getType(name);
      if (type instanceof AstClassDeclaration) {
        return type;
      }
    }
    return null;
  }

  getValue(identifier: Identifier | string): AstValue | null {
    const name = getName(identifier, 'identifier');

    if (name === 'undefined') {
      return new AstKeywordValue(factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword));
    }

    const variable = this.variable(name);
    if (variable) {
      return variable;
    }

    const enumDeclaration = this.enum(name);
    if (enumDeclaration) {
      return enumDeclaration;
    }

    const classDeclaration = this.class(name);
    if (classDeclaration) {
      return classDeclaration;
    }

    const functionDeclaration = this.function(name);
    if (functionDeclaration) {
      return functionDeclaration;
    }

    for (const imp of this.sourceFile.imports) {
      const value = imp.getValue(name);
      if (value) {
        return value;
      }
    }

    for (const exp of this.sourceFile.exports) {
      const value = exp.getValue(name);
      if (value) {
        return value;
      }
    }

    return null;
  }

  getType(identifier: Identifier | QualifiedName | string): AstType | null {
    const name = getName(identifier, 'identifier');

    const classDeclaration = this.class(name);
    if (classDeclaration) {
      return classDeclaration;
    }

    const enumDeclaration = this.enum(name);
    if (enumDeclaration) {
      return enumDeclaration;
    }

    const typeDeclaration = this.type(name);
    if (typeDeclaration) {
      return typeDeclaration;
    }

    const functionDeclaration = this.function(name);
    if (functionDeclaration) {
      return functionDeclaration;
    }

    for (const imp of this.sourceFile.imports) {
      const type = imp.getType(name);
      if (type) {
        return type;
      }
    }

    for (const exp of this.sourceFile.exports) {
      const type = exp.getType(name);
      if (type) {
        return type;
      }
    }

    return null;
  }

  private *getEnums() {
    for (const statement of this.block.statements) {
      if (isKind(statement, SyntaxKind.EnumDeclaration)) {
        yield new AstEnumDeclaration(this, statement);
      }
    }
  }

  private *getVariables() {
    for (const statement of this.block.statements) {
      if (isKind(statement, SyntaxKind.VariableStatement) && statement.declarationList) {
        for (const declarationNode of statement.declarationList.declarations) {
          yield new AstVariableDeclaration(this, statement, declarationNode);
        }
      }
    }
  }

  private *getExpressionStatements() {
    for (const statement of this.block.statements) {
      if (isKind(statement, SyntaxKind.ExpressionStatement)) {
        yield new AstExpressionStatement(this, statement);
      }
    }
  }

  private *getTypes() {
    for (const statement of this.block.statements) {
      if (isKind(statement, SyntaxKind.TypeAliasDeclaration)) {
        yield new AstTypeDeclaration(this, statement);
      }
    }
  }

  private *getClasses() {
    for (const statement of this.block.statements) {
      if (isKind(statement, SyntaxKind.ClassDeclaration)) {
        yield new AstClassDeclaration(this, statement);
      }
    }
  }

  private *getFunctions() {
    for (const statement of this.block.statements) {
      if (isKind(statement, SyntaxKind.FunctionDeclaration)) {
        yield new AstFunctionDeclaration(this, statement);
      }
    }
  }
}
