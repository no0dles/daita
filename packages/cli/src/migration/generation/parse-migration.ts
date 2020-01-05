import * as path from 'path';
import * as ts from 'typescript';
import { SyntaxKind } from 'typescript';
import {
  getChildNodes,
  getFirstChildNode,
  isKind,
  parseSourceFile,
} from './utils';
import {
  getSourceCodeSchema,
  MigrationDescription,
  MigrationStep,
  MigrationTree,
  SourceCodeModel,
  SourceCodeModelProperty,
  SourceCodeModelPropertyType,
} from '@daita/core';
import {
  ExtendedAddCollectionFieldMigrationStep,
  ExtendedAddCollectionMigrationStep,
  ExtendedDropCollectionFieldMigrationStep,
  ExtendedDropCollectionMigrationStep,
  ExtendedModifyCollectionFieldMigrationStep,
  ExtendedRelationalAddTableFieldMigrationStep,
  ExtendedRelationalAddTableForeignKey,
  ExtendedRelationalAddTableMigrationStep,
  ExtendedRelationalAddTablePrimaryKey,
  ExtendedRenameCollectionFieldMigrationStep,
} from '../steps';
import { SourceCodeModelUnionPropertyType } from '@daita/core/dist/model/source-code-model-union-property-type';
import { SourceCodeModelPrimitivePropertyType } from '@daita/core/dist/model/source-code-model-primitive-property-type';
import { SourceCodeModelReferencePropertyType } from '@daita/core/dist/model/source-code-model-reference-property-type';
import { SourceCodeModelArrayPropertyType } from '@daita/core/dist/model/source-code-model-array-property-type';

class ParseContext {
  private modelDeclarations: {
    [filename: string]: { [className: string]: SourceCodeModel };
  } = {};
  private migrationDeclarations: {
    [filename: string]: { [className: string]: MigrationDescription };
  } = {};

  containsSourceFile(sourceFile: ts.SourceFile) {
    if (this.modelDeclarations[sourceFile.fileName]) {
      return true;
    }

    if (this.migrationDeclarations[sourceFile.fileName]) {
      return true;
    }

    return false;
  }

  getModel(sourceFile: ts.SourceFile, name: string): SourceCodeModel | null {
    if (!this.modelDeclarations[sourceFile.fileName]) {
      importClasses(this, sourceFile);
    }
    if (!this.modelDeclarations[sourceFile.fileName]) {
      return null;
    }
    return this.modelDeclarations[sourceFile.fileName][name] || null;
  }

  addModel(sourceFile: ts.SourceFile, sourceCodeModel: SourceCodeModel) {
    if (!this.modelDeclarations[sourceFile.fileName]) {
      this.modelDeclarations[sourceFile.fileName] = {};
    }
    this.modelDeclarations[sourceFile.fileName][
      sourceCodeModel.name
    ] = sourceCodeModel;
  }
}

function parseMigrationSteps(
  arrayLiteral: ts.ArrayLiteralExpression,
): MigrationStep[] {
  const steps = new Array<MigrationStep>();

  const stepTypes = [
    ExtendedAddCollectionMigrationStep,
    ExtendedAddCollectionFieldMigrationStep,
    ExtendedDropCollectionMigrationStep,
    ExtendedDropCollectionFieldMigrationStep,
    ExtendedRenameCollectionFieldMigrationStep,
    ExtendedModifyCollectionFieldMigrationStep,
    ExtendedRelationalAddTableMigrationStep,
    ExtendedRelationalAddTableFieldMigrationStep,
    ExtendedRelationalAddTableForeignKey,
    ExtendedRelationalAddTablePrimaryKey,
  ];

  for (const element of arrayLiteral.elements) {
    const newExpression = isKind(element, ts.SyntaxKind.NewExpression);
    if (!newExpression) {
      continue;
    }

    const expressionArgs = newExpression.arguments || [];
    if (!expressionArgs) {
      break;
    }

    const migrationType = getIdentifier(newExpression.expression);

    for (const stepType of stepTypes) {
      if (stepType.name !== 'Extended' + migrationType) {
        continue;
      }

      const step = stepType.parse(expressionArgs.filter(e => !!e));
      if (step) {
        steps.push(step);
      }
      break;
    }
  }

  return steps;
}

function parseMigration(
  fileName: string,
  sourceFile: ts.SourceFile,
): (MigrationDescription & { className: string }) | null {
  let id: string | null = null;
  let after: string | null = null;
  let resolve: string | null = null;
  const steps: MigrationStep[] = [];

  const classDeclaration = getFirstChildNode(
    sourceFile,
    ts.SyntaxKind.ClassDeclaration,
  );
  if (!classDeclaration) {
    return null;
  }

  const classNameIdentifier = isKind(
    classDeclaration.name,
    ts.SyntaxKind.Identifier,
  );
  if (!classNameIdentifier) {
    return null;
  }

  const properties = getChildNodes(
    classDeclaration,
    ts.SyntaxKind.PropertyDeclaration,
  );
  for (const property of properties) {
    const propertyName = getIdentifier(property.name as ts.Identifier);
    if (!property.initializer) {
      continue;
    }

    switch (propertyName) {
      case 'after':
        after = getIdentifier(property.initializer as ts.StringLiteral);
        break;
      case 'resolve':
        resolve = getIdentifier(property.initializer as ts.StringLiteral);
        break;
      case 'id':
        id = getIdentifier(property.initializer as ts.StringLiteral);
        break;
      case 'steps':
        if (
          property.initializer.kind === ts.SyntaxKind.ArrayLiteralExpression
        ) {
          steps.push(
            ...parseMigrationSteps(
              property.initializer as ts.ArrayLiteralExpression,
            ),
          );
        }
        break;
    }
  }

  if (id !== null && steps.length > 0) {
    return {
      id,
      steps,
      after: after || undefined,
      resolve: resolve || undefined,
      className: classNameIdentifier.text,
    };
  }

  return null;
}

export function parseModelSchema(
  sourceFile: ts.SourceFile,
  schemaName: string,
) {
  const collections = parseSchemaCollections(sourceFile, schemaName);
  const tables = parseSchemaTables(sourceFile, schemaName);
  return getSourceCodeSchema(collections, tables);
}

export interface SchemaDeclaration {
  name: string;
  type: 'relational' | 'document';
}

export function getSchemas(sourceFile: ts.SourceFile): SchemaDeclaration[] {
  const variableStatements = getChildNodes(
    sourceFile,
    ts.SyntaxKind.VariableStatement,
  );
  const schemas: SchemaDeclaration[] = [];
  for (const variableStatement of variableStatements) {
    for (const declaration of variableStatement.declarationList.declarations) {
      const newExpression = isKind(
        declaration.initializer,
        ts.SyntaxKind.NewExpression,
      );
      if (!newExpression) {
        continue;
      }

      const classNameIdentifier = isKind(
        newExpression.expression,
        SyntaxKind.Identifier,
      );
      if (!classNameIdentifier) {
        continue;
      }

      const name = getIdentifier(declaration.name);
      if (!name) {
        continue;
      }

      if (classNameIdentifier.text === 'RelationalSchema') {
        schemas.push({
          name,
          type: 'relational',
        });
      } else if (classNameIdentifier.text === 'DocumentSchema') {
        schemas.push({
          name,
          type: 'document',
        });
      }
    }
  }
  return schemas;
}

export interface ParsedMigrations {
  migrationTree: MigrationTree;
  migrationFiles: {
    [key: string]: { sourceFile: ts.SourceFile; name: string; id: string };
  };
}

export function parseSchemaMigrations(
  sourceFile: ts.SourceFile,
  variableName: string,
): ParsedMigrations {
  const migrationTree = new MigrationTree();
  const migrationFiles: {
    [key: string]: { sourceFile: ts.SourceFile; name: string; id: string };
  } = {};

  const migrationCalls = getMethodCalls(sourceFile, variableName, [
    'migration',
  ]);
  const imports = getImports(sourceFile);

  for (const migrationCall of migrationCalls) {
    const arg = migrationCall.args[0];
    const importFile = imports[arg];
    const migrationFile = parseSourceFile(importFile);
    const migration = parseMigration(importFile, migrationFile);
    if (migration) {
      migrationFiles[migration.id] = {
        sourceFile: migrationFile,
        name: migration.className,
        id: migration.id,
      };
      migrationTree.add(migration);
    }
  }

  return { migrationTree, migrationFiles };
}

export function parseSchemaTables(
  sourceFile: ts.SourceFile,
  variableName: string,
) {
  const tables: SourceCodeModel[] = [];

  const parseContext = new ParseContext();
  const calls = getMethodCalls(sourceFile, variableName, ['table']);
  const imports = getImports(sourceFile);

  for (const call of calls) {
    {
      const arg = call.args[0];
      const importFile = imports[arg];
      const modelFile = parseSourceFile(importFile);

      const argClass = parseContext.getModel(modelFile, arg);
      if (!argClass) {
        continue;
      }

      const primaryKeys = call.args[1] || ['id'];
      argClass.setPrimaryKeys(primaryKeys);
      tables.push(argClass);
    }
  }

  return tables;
}

export function parseSchemaCollections(
  sourceFile: ts.SourceFile,
  variableName: string,
) {
  const collections: SourceCodeModel[] = [];

  const parseContext = new ParseContext();
  const calls = getMethodCalls(sourceFile, variableName, ['collection']);
  const imports = getImports(sourceFile);

  for (const call of calls) {
    {
      const arg = call.args[0];
      const importFile = imports[arg];
      const modelFile = parseSourceFile(importFile);

      const argClass = parseContext.getModel(modelFile, arg);
      if (!argClass) {
        continue;
      }

      collections.push(argClass);
    }
  }

  return collections;
}

function importClasses(parseContext: ParseContext, sourceFile: ts.SourceFile) {
  if (parseContext.containsSourceFile(sourceFile)) {
    return;
  }

  const models = new Array<{
    model: SourceCodeModel;
    classDeclaration: ts.ClassDeclaration;
  }>();

  const classDeclarations = getChildNodes(
    sourceFile,
    ts.SyntaxKind.ClassDeclaration,
  );
  for (const classDeclaration of classDeclarations) {
    const identifier = getFirstChildNode(
      classDeclaration,
      ts.SyntaxKind.Identifier,
    );
    if (!identifier) {
      throw new Error(`missing class name in file ${sourceFile.fileName}`);
    }
    const name = identifier.text;

    const model = new SourceCodeModel(name);
    models.push({ model, classDeclaration });
    parseContext.addModel(sourceFile, model);
  }

  for (const model of models) {
    const properties = getChildNodes(
      model.classDeclaration,
      ts.SyntaxKind.PropertyDeclaration,
    );
    for (const property of properties) {
      model.model.addProperty(
        parseProperty(parseContext, sourceFile, property),
      );
    }
  }
}

function getMethodCalls(
  sourceFile: ts.SourceFile,
  variableName: string,
  methods: string[],
) {
  const calls: { method: string; args: any[] }[] = [];
  const expressionStatements = getChildNodes(
    sourceFile,
    ts.SyntaxKind.ExpressionStatement,
  );

  for (const expressionStatement of expressionStatements) {
    const callExpression = isKind(
      expressionStatement.expression,
      ts.SyntaxKind.CallExpression,
    );
    if (!callExpression) {
      continue;
    }

    const propertyAccessExpr = isKind(
      callExpression.expression,
      ts.SyntaxKind.PropertyAccessExpression,
    );
    if (!propertyAccessExpr) {
      continue;
    }

    const variableExpression = isKind(
      propertyAccessExpr.expression,
      ts.SyntaxKind.Identifier,
    );
    if (!variableExpression) {
      continue;
    }

    if (variableExpression.text !== variableName) {
      continue;
    }

    if (methods.indexOf(propertyAccessExpr.name.text) === -1) {
      continue;
    }

    const call: { method: string; args: any[] } = {
      method: propertyAccessExpr.name.escapedText.toString(),
      args: [],
    };

    for (const arg of callExpression.arguments) {
      const name = getIdentifier(arg);
      if (name) {
        call.args.push(name);
      } else {
        if (arg.kind === ts.SyntaxKind.ObjectLiteralExpression) {
          const objectLiteral = <ts.ObjectLiteralExpression>arg;
          for (const prop of objectLiteral.properties) {
            if (prop.kind === ts.SyntaxKind.PropertyAssignment) {
              const propAssign = <ts.PropertyAssignment>prop;
              const name = getIdentifier(propAssign.name as ts.Expression);
              if (name !== 'key') {
                continue;
              }

              const primaryKeys = [];
              if (
                propAssign.initializer.kind ===
                ts.SyntaxKind.ArrayLiteralExpression
              ) {
                const arrayElm = <ts.ArrayLiteralExpression>(
                  propAssign.initializer
                );
                for (const elm of arrayElm.elements) {
                  if (elm.kind === ts.SyntaxKind.StringLiteral) {
                    const textElm = <ts.StringLiteral>elm;
                    primaryKeys.push(textElm.text);
                  }
                }
              } else if (
                propAssign.initializer.kind === ts.SyntaxKind.StringLiteral
              ) {
                const textElm = <ts.StringLiteral>propAssign.initializer;
                primaryKeys.push(textElm.text);
              }

              call.args.push(primaryKeys);
            }
          }
        }
      }
    }

    calls.push(call);
  }

  return calls;
}

export function getIdentifier(
  expression: ts.Expression | ts.Identifier | ts.BindingName,
) {
  if (expression.kind === ts.SyntaxKind.Identifier) {
    const identfier = <ts.Identifier>expression;
    return identfier.text;
  }

  if (expression.kind === ts.SyntaxKind.StringLiteral) {
    const stringLiteral = <ts.StringLiteral>expression;
    return stringLiteral.text;
  }

  return null;
}

function getImports(sourceFile: ts.SourceFile) {
  const result: { [indentifier: string]: string } = {};
  const importDeclarations = getChildNodes(
    sourceFile,
    ts.SyntaxKind.ImportDeclaration,
  );

  for (const importDeclaration of importDeclarations) {
    if (!importDeclaration.importClause) {
      continue;
    }

    if (!importDeclaration.importClause.namedBindings) {
      continue;
    }

    const namedImport = isKind(
      importDeclaration.importClause.namedBindings,
      ts.SyntaxKind.NamedImports,
    );
    if (!namedImport) {
      continue;
    }

    const file = getIdentifier(importDeclaration.moduleSpecifier);
    if (!file) {
      continue;
    }

    const fileName = path.join(path.dirname(sourceFile.fileName), file + '.ts');
    for (const element of namedImport.elements) {
      result[element.name.text] = fileName;
    }
  }

  return result;
}

function parseProperty(
  parsedSources: ParseContext,
  sourceFile: ts.SourceFile,
  node: ts.PropertyDeclaration,
): SourceCodeModelProperty {
  const name = getIdentifier(node.name as ts.Identifier);

  if (!node.type) {
    throw new Error(`missing type on class ... property ${name}`);
  }

  if (!name) {
    throw new Error('missing name');
  }

  return new SourceCodeModelProperty(
    name,
    parseType(parsedSources, sourceFile, node.type),
  );
}

function parseType(
  parsedSources: ParseContext,
  sourceFile: ts.SourceFile,
  node: ts.TypeNode,
): SourceCodeModelPropertyType {
  switch (node.kind) {
    case ts.SyntaxKind.UnionType:
      return parseUnion(parsedSources, sourceFile, node as ts.UnionTypeNode);
    case ts.SyntaxKind.ArrayType:
      return parseArray(parsedSources, sourceFile, node as ts.ArrayTypeNode);
    case ts.SyntaxKind.TypeReference:
      const typeNode = node as ts.TypeReferenceNode;
      return parseTypeRef(parsedSources, sourceFile, typeNode);
    case ts.SyntaxKind.StringKeyword:
      return new SourceCodeModelPrimitivePropertyType('string');
    case ts.SyntaxKind.NumberKeyword:
      return new SourceCodeModelPrimitivePropertyType('number');
    case ts.SyntaxKind.NullKeyword:
      return new SourceCodeModelPrimitivePropertyType('null');
    case ts.SyntaxKind.BooleanKeyword:
      return new SourceCodeModelPrimitivePropertyType('boolean');
  }

  throw new Error('unknown type ' + ts.SyntaxKind[node.kind]);
}

function parseUnion(
  parsedSources: ParseContext,
  sourceFile: ts.SourceFile,
  node: ts.UnionTypeNode,
): SourceCodeModelUnionPropertyType {
  return new SourceCodeModelUnionPropertyType(
    node.types.map(type => parseType(parsedSources, sourceFile, type)),
  );
}

function parseArray(
  parsedSources: ParseContext,
  sourceFile: ts.SourceFile,
  node: ts.ArrayTypeNode,
): SourceCodeModelArrayPropertyType {
  return new SourceCodeModelArrayPropertyType(
    parseType(parsedSources, sourceFile, node.elementType),
  );
}

function parseTypeRef(
  parsedSources: ParseContext,
  sourceFile: ts.SourceFile,
  node: ts.TypeReferenceNode,
): SourceCodeModelReferencePropertyType {
  const name = getIdentifier(node.typeName as ts.Identifier);
  if (!name) {
    throw new Error(`Reference name not valid for ${node.typeName}`);
  }

  const imports = getImports(sourceFile);
  const fileName = imports[name];
  if (fileName) {
    const modelFile = parseSourceFile(fileName);
    const model = parsedSources.getModel(modelFile, name);
    if (model) {
      return new SourceCodeModelReferencePropertyType(model);
    }
  }

  const model = parsedSources.getModel(sourceFile, name);
  if (model) {
    return new SourceCodeModelReferencePropertyType(model);
  }

  throw new Error(`Reference not found ${name}`);
}
