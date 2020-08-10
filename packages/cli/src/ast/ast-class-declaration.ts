import { AstError, isKind } from '../ast/utils';
import { getName, hasModifier } from './utils';
import { AstMethodDeclaration } from './ast-method-declaration';
import { AstClassDeclarationProp } from './ast-class-declaration-prop';
import { AstBlock } from './ast-block';
import { ClassDeclaration, SyntaxKind } from 'typescript';
import { AstTypeParameterDeclaration } from './ast-type-parameter-declaration';
import { AstNode } from './ast-node';

export class AstClassDeclaration implements AstNode {
  constructor(private block: AstBlock,
              public node: ClassDeclaration) {
  }

  get name(): string {
    if (!this.node.name) {
      throw new AstError(this.node, 'missing class name');
    }
    return getName(this.node.name, 'class declaration');
  }

  get typeParameters() {
    return this.getTypeParameters();
  }

  get extends(): AstClassDeclaration | null {
    if (!this.node.heritageClauses) {
      return null;
    }

    for (const heritage of this.node.heritageClauses) {
      if (heritage.token === SyntaxKind.ExtendsKeyword) {
        const heritageType = heritage.types[0];
        if (!heritageType) {
          return null;
        }

        const extendName = getName(heritageType.expression, 'expression with type arguments');
        return this.block.class(extendName);
      }
    }

    return null;
  }

  get methods(): Generator<AstMethodDeclaration> {
    return this.getMethods();
  }

  get props(): Generator<AstClassDeclarationProp> {
    return this.getProps();
  }

  get staticProps(): Generator<AstClassDeclarationProp> {
    return this.getStaticProps();
  }

  get allProps(): Generator<AstClassDeclarationProp> {
    return this.getAllProps();
  }

  method(name: string) {
    for (const method of this.methods) {
      if (method.name === name) {
        return method;
      }
    }
    return null;
  }

  staticProp(name: string) {
    for (const prop of this.staticProps) {
      if (prop.name === name) {
        return prop;
      }
    }
    return null;
  }

  prop(name: string) {
    for (const prop of this.props) {
      if (prop.name === name) {
        return prop;
      }
    }
    return null;
  }

  private* getTypeParameters() {
    if (!this.node.typeParameters) {
      return;
    }

    for (const typeParameter of this.node.typeParameters) {
      yield new AstTypeParameterDeclaration(this.block, typeParameter);
    }
  }

  private* getMethods() {
    for (const member of this.node.members) {
      const methodDeclaration = isKind(member, SyntaxKind.MethodDeclaration);
      if (methodDeclaration) {
        yield new AstMethodDeclaration(this.block, methodDeclaration);
      }
    }
  }

  private* getStaticProps() {
    for (const prop of this.props) {
      if (prop.static) {
        yield prop;
      }
    }
  }

  private* getAllProps() {
    const extended = this.extends;
    if (extended) {
      for (const prop of extended.allProps) {
        yield prop;
      }
    }

    for (const prop of this.props) {
      yield prop;
    }
  }

  private* getProps() {
    for (const member of this.node.members) {
      const propertyDeclaration = isKind(member, SyntaxKind.PropertyDeclaration);
      if (propertyDeclaration) {
        yield new AstClassDeclarationProp(this.block, propertyDeclaration);
      }
    }
  }

  get exported(): boolean {
    return hasModifier(this.node.modifiers, SyntaxKind.ExportKeyword);
  }
}
