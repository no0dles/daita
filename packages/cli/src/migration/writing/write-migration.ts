import * as ts from 'typescript';
import {ScriptKind, ScriptTarget} from 'typescript';
import {getIdentifierName, isKind, parseSourceFile} from '../../ast/utils';
import * as fs from 'fs';
import {getMigrationName} from '../utils';
import { writeRelationalMigrationStep } from '../steps/write-migration-step';
import { MigrationStep } from '@daita/orm';

export function addMigrationImport(
  schemaFilePath: string,
  migrationFilePath: string,
  migrationName: string,
) {
  const sourceFile = parseSourceFile(schemaFilePath);

  let lastImport: ts.ImportDeclaration | null = null;
  for (const statement of sourceFile.statements) {
    const importDeclaration = isKind(
      statement,
      ts.SyntaxKind.ImportDeclaration,
    );
    if (!importDeclaration && lastImport) {
      break;
    } else if (importDeclaration) {
      lastImport = importDeclaration;
    }
  }

  if (!lastImport) {
    return false;
  }

  const pos = lastImport ? lastImport.getEnd() : 0;
  const content = fs.readFileSync(schemaFilePath).toString();
  const prefix = content.substring(0, pos);
  const suffix = content.substring(pos);

  fs.writeFileSync(
    schemaFilePath,
    `${prefix}${
      pos !== 0 ? '\n' : ''
    }import {${migrationName}} from '${migrationFilePath}';${suffix}`,
  );
  return true;
}

export function removeMigrationRegistration(
  schemaFilePath: string,
  migrationName: string,
) {
  const sourceFile = parseSourceFile(schemaFilePath);
  const content = fs.readFileSync(schemaFilePath).toString();

  for (const statement of sourceFile.statements) {
    const expressionStatement = isKind(
      statement,
      ts.SyntaxKind.ExpressionStatement,
    );
    if (!expressionStatement) {
      continue;
    }

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

    if (propertyAccessExpr.name.text !== 'migration') {
      continue;
    }

    for (const arg of callExpression.arguments) {
      const name = getIdentifierName(arg);
      if (name === migrationName) {
        let prefix = content.substring(0, expressionStatement.getStart());
        let suffix = content.substring(
          getEndOfLine(content, expressionStatement.getEnd()),
        );
        fs.writeFileSync(schemaFilePath, `${prefix}${suffix}`);
        return true;
      }
    }
  }

  return false;
}

export function removeMigrationImport(
  schemaFilePath: string,
  migrationFilePath: string,
  migrationName: string,
) {
  const sourceFile = parseSourceFile(schemaFilePath);
  const content = fs.readFileSync(schemaFilePath).toString();

  for (const statement of sourceFile.statements) {
    const importDeclaration = isKind(
      statement,
      ts.SyntaxKind.ImportDeclaration,
    );
    if (!importDeclaration) {
      continue;
    }

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

    const identifiers: string[] = namedImport.elements.map(element =>
      element.name.escapedText.toString(),
    );
    if (identifiers.length === 1) {
      if (identifiers[0] === migrationName) {
        let prefix = content.substring(0, importDeclaration.getStart());
        let suffix = content.substring(
          getEndOfLine(content, importDeclaration.getEnd()),
        );
        fs.writeFileSync(schemaFilePath, `${prefix}${suffix}`);
        return true;
      }
    } else {
      const index = identifiers.indexOf(migrationName);
      if (index === -1) {
        continue;
      }

      const element = namedImport.elements[index];
      let prefix = content.substring(0, element.getStart());
      let suffix = content.substring(getEndOfLine(content, element.getEnd()));
      fs.writeFileSync(schemaFilePath, `${prefix}${suffix}`);
      return true;
    }
  }

  return false;
}

function getEndOfLine(content: string, index: number): number {
  const newChar = content[index];
  if (newChar === '\n') {
    return index + 1;
  }
  return index;
}

export function addMigrationRegistration(
  schemaFilePath: string,
  variableName: string,
  migrationName: string,
) {
  const sourceFile = parseSourceFile(schemaFilePath);
  const content = fs.readFileSync(schemaFilePath).toString();

  let lastExpression: ts.ExpressionStatement | null = null;
  for (const statement of sourceFile.statements) {
    const expressionStatement = isKind(
      statement,
      ts.SyntaxKind.ExpressionStatement,
    );
    if (!expressionStatement) {
      continue;
    }

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

    lastExpression = expressionStatement;
  }

  if (!lastExpression) {
    return false;
  }

  const pos = lastExpression.getEnd();
  let prefix = content.substring(0, pos);
  let suffix = content.substring(pos);
  while (
    prefix.endsWith('\n') ||
    prefix.endsWith('\r') ||
    prefix.endsWith(' ')
    ) {
    suffix = prefix[prefix.length - 1] + suffix;
    prefix = prefix.substr(0, prefix.length - 1);
  }

  fs.writeFileSync(
    schemaFilePath,
    `${prefix}\n${variableName}.migration(${migrationName});${suffix}`,
  );
  return true;
}

export function writeMigration(
  name: string,
  after: string | undefined,
  resolve: string | undefined,
  steps: MigrationStep[],
): string {
  const importStmt = ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      undefined,
      ts.createNamedImports(
        [ts.createImportSpecifier(undefined, ts.createIdentifier('MigrationDescription'))],
      ),
    ),
    ts.createStringLiteral('@daita/orm'),
  );

  const properties: ts.PropertyAssignment[] = [
    ts.createPropertyAssignment(
      ts.createIdentifier('id'),
      ts.createStringLiteral(name),
    ),
  ];

  if (after) {
    properties.push(
      ts.createPropertyAssignment(
        ts.createIdentifier('after'),
        ts.createStringLiteral(after),
      ),
    );
  }

  if (resolve) {
    properties.push(
      ts.createPropertyAssignment(
        ts.createIdentifier('resolve'),
        ts.createStringLiteral(resolve),
      ),
    );
  }

  properties.push(
    ts.createPropertyAssignment(
      ts.createIdentifier('steps'),
      ts.createArrayLiteral(
        steps.map(step => writeRelationalMigrationStep(step)),
        true,
      ),
    ));

  const exportStmt = ts.createVariableStatement(
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.createVariableDeclarationList([ts.createVariableDeclaration(
      ts.createIdentifier(getMigrationName(name)),
      ts.createTypeReferenceNode(
        ts.createIdentifier('MigrationDescription'),
        undefined,
      ),
      ts.createObjectLiteral(
        properties,
        true,
      ),
      )],
      ts.NodeFlags.Const,
    ));

  const sourceFile = ts.createSourceFile(
    `${name}.migration.ts`,
    '',
    ScriptTarget.Latest,
    false,
    ScriptKind.TS,
  );
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });

  const part1 = printer.printNode(
    ts.EmitHint.Unspecified,
    importStmt,
    sourceFile,
  );
  const part2 = printer.printNode(
    ts.EmitHint.Unspecified,
    exportStmt,
    sourceFile,
  );
  return `${part1}\n\n${part2}`;
}
