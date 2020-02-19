import * as ts from 'typescript';
import {
  getSourceCodeSchema,
  MigrationDescription,
  MigrationStep,
  MigrationTree, Permission,
  SourceCodeModel,
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
import {SourceCodeModelUnionPropertyType} from '@daita/core/dist/model/source-code-model-union-property-type';
import {SourceCodeModelPrimitivePropertyType} from '@daita/core/dist/model/source-code-model-primitive-property-type';
import {SourceCodeModelReferencePropertyType} from '@daita/core/dist/model/source-code-model-reference-property-type';
import {SourceCodeModelArrayPropertyType} from '@daita/core/dist/model/source-code-model-array-property-type';
import {AstSourceFile} from '../../ast/ast-source-file';
import {AstVariable} from '../../ast/ast-variable';
import {AstClassDeclaration} from '../../ast/ast-class-declaration';
import {AstNewConstructor} from '../../ast/ast-new-constructor';


function parseMigrationSteps(
  migrationSteps: AstNewConstructor[],
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

  for (const migrationStep of migrationSteps) {
    for (const stepType of stepTypes) {
      if (stepType.name !== 'Extended' + migrationStep.typeName) {
        continue;
      }

      const step = stepType.parse(migrationStep.arguments);
      if (step) {
        steps.push(step);
      }
      break;
    }
  }

  return steps;
}

function parseMigration(
  astClassDeclaration: AstClassDeclaration,
): MigrationDescription {
  const idProp = astClassDeclaration.getProperty('id');
  const afterProp = astClassDeclaration.getProperty('after');
  const resolveProp = astClassDeclaration.getProperty('resolve');
  const stepsProp = astClassDeclaration.getProperty('steps');

  let after: string | null = null;
  let resolve: string | null = null;
  const steps: MigrationStep[] = [];

  if (!idProp || !idProp.initializer || !idProp.initializer.stringValue) {
    throw new Error('missing id prop in migration');
  }

  if (afterProp && afterProp.initializer && afterProp.initializer.stringValue) {
    after = afterProp.initializer.stringValue;
  }

  if (resolveProp && resolveProp.initializer && resolveProp.initializer.stringValue) {
    resolve = resolveProp.initializer.stringValue;
  }

  if (stepsProp && stepsProp.initializer && stepsProp.initializer.arrayValue) {
    //TODO parse steps
  }

  return {
    id: idProp.initializer.stringValue,
    after: after || undefined,
    resolve: resolve || undefined,
    steps,
  };
}

export interface SchemaDeclaration {
  variable: AstVariable;
  type: 'relational' | 'document';
}

export function getSchemas(sourceFile: AstSourceFile): SchemaDeclaration[] {
  const schemas: SchemaDeclaration[] = [];
  const relationalSchemaVariables = sourceFile.getVariables();
  for (const relationalSchemaVariable of relationalSchemaVariables) {
    const initializer = relationalSchemaVariable.initializer;
    if (initializer && initializer.newConstructor && initializer.newConstructor.typeName === 'RelationalSchema') {
      schemas.push({
        variable: relationalSchemaVariable,
        type: 'relational',
      });
    }
  }
  const documentSchemaVariables = sourceFile.getVariables();
  for (const documentSchemaVariable of documentSchemaVariables) {
    const initializer = documentSchemaVariable.initializer;
    if (initializer && initializer.newConstructor && initializer.newConstructor.typeName === 'RelationalSchema') {
      schemas.push({
        variable: documentSchemaVariable,
        type: 'document',
      });
    }
  }
  return schemas;
}

export function parseSchemaPermissions(schemaVariable: AstVariable) {
  const permissions: { [key: string]: Permission<any>[] } = {};

  for (const permissionCalls of schemaVariable.getCalls({name: 'permission'})) {
    const builderArgument = permissionCalls.argument(0);

    if (!builderArgument) {
      console.log(builderArgument)
      throw new Error('invalid permission call');
    }

    const variable = builderArgument.variable;
    if (!variable) {
      throw new Error('invalid variable');
    }

    const pushCalls = variable.getCalls({name: 'push'});
    for (const pushCall of pushCalls) {
      const clsArg = pushCall.argument(0);
      const objArg = pushCall.argument(1);
      if (!clsArg || !objArg) {
        throw new Error('invalid push call');
      }

      const objVal = objArg.objectValue;
      if (!objVal) {
        throw new Error('invalid obj');
      }

      const type = objVal.property('type');
      if (type) {
        type.stringValue
      }
    }
  }

  return permissions;
}

export function parseSchemaMigrations(
  schemaVariable: AstVariable,
): MigrationTree {
  const migrationTree = new MigrationTree();

  const migrationCalls = schemaVariable.getCalls({name: 'migration'});
  for (const migrationCall of migrationCalls) {
    const migrationClassArg = migrationCall.argument(0);
    if (!migrationClassArg) {
      throw new Error('missing first arg in migration');
    }
    const classDeclaration = migrationClassArg.classDeclaration;
    if (!classDeclaration) {
      throw new Error('first arg is no class declaration');
    }
    const migration = parseMigration(classDeclaration);
    migrationTree.add(migration);
  }

  return migrationTree;
}

export function parseSchemaTables(
  schemaVariable: AstVariable,
) {
  const tables: AstClassDeclaration[] = [];

  const calls = schemaVariable.getCalls({name: 'table'});
  for (const call of calls) {
    const classArgument = call.argument(0);
    const optionsArgument = call.argument(1);

    if (!classArgument) {
      throw new Error('invalid table argument without class');
    }
    const classDeclaration = classArgument.classDeclaration;
    if (!classDeclaration) {
      throw new Error('first arg is no class');
    }

    const argClass = parseContext.getModel(modelFile, arg);
    if (!argClass) {
      continue;
    }

    const primaryKeys = call.args[1] || ['id'];
    argClass.setPrimaryKeys(primaryKeys);
    tables.push(argClass);
  }

  return tables;
}

export function parseSchemaCollections(
  schemaVariable: AstVariable,
): AstClassDeclaration[] {
  const classDeclarations = new Array<AstClassDeclaration>();

  const calls = schemaVariable.getCalls({name: 'collection'});
  for (const call of calls) {
    const classArgument = call.argument(0);
    if (!classArgument) {
      throw new Error('missing class arugment');
    }
    const classDeclaration = classArgument.classDeclaration;
    if (!classDeclaration) {
      throw new Error('first arg is not class arg');
    }
    classDeclarations.push(classDeclaration);
  }

  return classDeclarations;
}

// if (arg.kind === ts.SyntaxKind.ObjectLiteralExpression) {
//   const objectLiteral = <ts.ObjectLiteralExpression>arg;
//   for (const prop of objectLiteral.properties) {
//     if (prop.kind === ts.SyntaxKind.PropertyAssignment) {
//       const propAssign = <ts.PropertyAssignment>prop;
//       const name = getIdentifier(propAssign.name as ts.Expression);
//       if (name !== 'key') {
//         continue;
//       }
//
//       const primaryKeys = [];
//       if (
//         propAssign.initializer.kind ===
//         ts.SyntaxKind.ArrayLiteralExpression
//       ) {
//         const arrayElm = <ts.ArrayLiteralExpression>(
//           propAssign.initializer
//         );
//         for (const elm of arrayElm.elements) {
//           if (elm.kind === ts.SyntaxKind.StringLiteral) {
//             const textElm = <ts.StringLiteral>elm;
//             primaryKeys.push(textElm.text);
//           }
//         }
//       } else if (
//         propAssign.initializer.kind === ts.SyntaxKind.StringLiteral
//       ) {
//         const textElm = <ts.StringLiteral>propAssign.initializer;
//         primaryKeys.push(textElm.text);
//       }
//
//       call.args.push(primaryKeys);
//     }
//   }
// }


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
