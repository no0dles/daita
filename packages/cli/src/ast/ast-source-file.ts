import { getChildNodes, getIdentifierName, isKind } from './utils';
import * as path from 'path';
import * as ts from 'typescript';
import { AstClassDeclaration } from './ast-class-declaration';
import { AstImport } from './ast-import';
import { AstVariable } from './ast-variable';
import { AstExport } from './ast-export';
import { AstContext } from './ast-context';

export class AstSourceFile {
  constructor(private context: AstContext,
              private sourceFile: ts.SourceFile) {
  }

  get fileName() {
    return this.sourceFile.fileName;
  }

  getVariable(name: string, options?: { includeImported?: boolean }): AstVariable | null {
    const variables = this.getVariables(options);
    for (const variable of variables) {
      if (variable.name === name) {
        return variable;
      }
    }

    return null;
  }

  getVariables(options?: { includeImported?: boolean }): AstVariable[] {
    const astVariables = new Array<AstVariable>();
    const variableStatements = getChildNodes(
      this.sourceFile,
      ts.SyntaxKind.VariableStatement,
    );

    for (const variableStatement of variableStatements) {
      for (const declaration of variableStatement.declarationList.declarations) {
        const variable = new AstVariable(this, this.sourceFile, variableStatement, declaration);
        astVariables.push(variable);
      }
    }

    if (options && options.includeImported) {
      const astImports = this.getImports();
      for (const astImport of astImports) {
        const exports = astImport.getExported();
        for (const exported of exports) {
          const exportedVariable = exported.variable;
          if (exportedVariable) {
            astVariables.push(exportedVariable);
          }
        }
      }
    }

    return astVariables;
  }

  getImports(): AstImport[] {
    const importDeclarations = getChildNodes(this.sourceFile, ts.SyntaxKind.ImportDeclaration);
    const astImports = new Array<AstImport>();
    for (const importDeclaration of importDeclarations) {
      astImports.push(new AstImport(this.context, this, importDeclaration));
    }
    return astImports;
  }

  getExports(options?: { excludeClasses?: boolean, excludeVariables?: boolean }): AstExport[] {
    const astExports = new Array<AstExport>();

    if (!options || !options.excludeClasses) {
      const classDeclarations = this.getClassDeclarations().filter(cls => cls.exported);
      for (const classDeclaration of classDeclarations) {
        const name = classDeclaration.name;
        if (name) {
          astExports.push(new AstExport(this, name));
        }
      }
      //TODO perf use classDeclarations
    }

    if (!options || !options.excludeVariables) {
      const variables = this.getVariables({ includeImported: true })
        .filter(v => v.exported);
      for (const variable of variables) {
        astExports.push(new AstExport(this, variable.name));
      }
      //TODO perf use variables
    }

    const exportDeclarations = getChildNodes(this.sourceFile, ts.SyntaxKind.ExportDeclaration);
    for (const exportDeclaration of exportDeclarations) {
      if (!exportDeclaration.moduleSpecifier) {
        continue;
      }
      const exportFile = getIdentifierName(exportDeclaration.moduleSpecifier);
      if (!exportFile.startsWith('.')) {
        return []; //TODO node_modules
      }

      const exportFileName = path.join(path.dirname(this.sourceFile.fileName), exportFile);
      const exportSourceFile = this.context.get(exportFileName);
      if (!exportSourceFile) {
        throw new Error('unable to locate export source');
      }

      if (exportDeclaration.exportClause) {
        const namedExports = isKind(exportDeclaration.exportClause, ts.SyntaxKind.NamedExports);
        if (namedExports) {
          for (const element of namedExports.elements) {
            const name = getIdentifierName(element.name);
            const exportedClass = exportSourceFile.getExport(name);
            if (exportedClass) {
              astExports.push(exportedClass);
            }
          }
        }
      } else {
        astExports.push(...exportSourceFile.getExports(options));
      }
    }

    const defaultExport = this.getDefaultExport();
    if (defaultExport) {
      astExports.push(defaultExport);
    }

    return astExports;
  }

  getExport(name: string): AstExport | null {
    const classExports = this.getExports();
    for (const classExport of classExports) {
      if (classExport.name === name) {
        return classExport;
      }
    }
    return null;
  }

  getDefaultExport(): AstExport | null {
    const exportAssignments = getChildNodes(this.sourceFile, ts.SyntaxKind.ExportAssignment);
    if (!exportAssignments[0]) {
      return null;
    }
    const identifier = getIdentifierName(exportAssignments[0].expression);
    return new AstExport(this, identifier);
  }

  getClassDeclarations(options?: { includeImport?: boolean }): AstClassDeclaration[] {
    const classDeclarations = getChildNodes(this.sourceFile, ts.SyntaxKind.ClassDeclaration);
    const astClassDeclarations = new Array<AstClassDeclaration>();
    for (const classDeclaration of classDeclarations) {
      astClassDeclarations.push(new AstClassDeclaration(this, classDeclaration));
    }
    if (options && options.includeImport) {
      const astImports = this.getImports();
      for (const astImport of astImports) {
        const exports = astImport.getExported();
        for (const exported of exports) {
          const exportedClassDeclaration = exported.classDeclaration;
          if (exportedClassDeclaration) {
            astClassDeclarations.push(exportedClassDeclaration);
          }
        }
      }
    }
    return astClassDeclarations;
  }

  getClassDeclaration(name: string, options?: { includeImport?: boolean }): AstClassDeclaration | null {
    const classDeclarations = this.getClassDeclarations(options);
    for (const classDeclaration of classDeclarations) {
      if (classDeclaration.name === name) {
        return classDeclaration;
      }
    }
    return null;
  }
}
