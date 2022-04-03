import {
  createPrinter,
  createSourceFile,
  EmitHint,
  ExpressionStatement,
  factory,
  ImportDeclaration,
  NewLineKind,
  NodeFlags,
  PropertyAssignment,
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
} from 'typescript';
import { getIdentifierName, isKind, parseSourceFile } from '../../ast/utils';
import * as fs from 'fs';
import { getMigrationName } from '../utils';
import { createExpressionFromValue } from './write-migration-step';
import { Migration, OrmSql } from '@daita/orm';

export function addMigrationImport(schemaFilePath: string, migrationFilePath: string, migrationName: string) {
  const sourceFile = parseSourceFile(schemaFilePath);

  let lastImport: ImportDeclaration | null = null;
  for (const statement of sourceFile.statements) {
    const isImportDeclaration = isKind(statement, SyntaxKind.ImportDeclaration);
    if (!isImportDeclaration && lastImport) {
      break;
    } else if (isImportDeclaration) {
      lastImport = statement;
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
    `${prefix}${pos !== 0 ? '\n' : ''}import {${migrationName}} from '${migrationFilePath}';${suffix}`,
  );
  return true;
}

export function removeMigrationRegistration(schemaFilePath: string, migrationName: string) {
  const sourceFile = parseSourceFile(schemaFilePath);
  const content = fs.readFileSync(schemaFilePath).toString();

  for (const statement of sourceFile.statements) {
    if (!isKind(statement, SyntaxKind.ExpressionStatement)) {
      continue;
    }

    if (!isKind(statement.expression, SyntaxKind.CallExpression)) {
      continue;
    }

    if (!isKind(statement.expression.expression, SyntaxKind.PropertyAccessExpression)) {
      continue;
    }

    if (statement.expression.expression.name.text !== 'migration') {
      continue;
    }

    for (const arg of statement.expression.arguments) {
      const name = getIdentifierName(arg);
      if (name === migrationName) {
        const prefix = content.substring(0, statement.expression.getStart());
        const suffix = content.substring(getEndOfLine(content, statement.expression.getEnd()));
        fs.writeFileSync(schemaFilePath, `${prefix}${suffix}`);
        return true;
      }
    }
  }

  return false;
}

export function removeMigrationImport(schemaFilePath: string, migrationFilePath: string, migrationName: string) {
  const sourceFile = parseSourceFile(schemaFilePath);
  const content = fs.readFileSync(schemaFilePath).toString();

  for (const statement of sourceFile.statements) {
    if (!isKind(statement, SyntaxKind.ImportDeclaration)) {
      continue;
    }

    if (!statement.importClause) {
      continue;
    }

    if (!statement.importClause.namedBindings) {
      continue;
    }

    const namedImport = statement.importClause.namedBindings;
    if (!isKind(namedImport, SyntaxKind.NamedImports)) {
      continue;
    }

    const identifiers: string[] = namedImport.elements.map((element) => element.name.escapedText.toString());
    if (identifiers.length === 1) {
      if (identifiers[0] === migrationName) {
        const prefix = content.substring(0, statement.getStart());
        const suffix = content.substring(getEndOfLine(content, statement.getEnd()));
        fs.writeFileSync(schemaFilePath, `${prefix}${suffix}`);
        return true;
      }
    } else {
      const index = identifiers.indexOf(migrationName);
      if (index === -1) {
        continue;
      }

      const element = namedImport.elements[index];
      const prefix = content.substring(0, element.getStart());
      const suffix = content.substring(getEndOfLine(content, element.getEnd()));
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

export function addMigrationRegistration(schemaFilePath: string, variableName: string, migrationName: string) {
  const sourceFile = parseSourceFile(schemaFilePath);
  const content = fs.readFileSync(schemaFilePath).toString();

  let lastExpression: ExpressionStatement | null = null;
  for (const statement of sourceFile.statements) {
    if (!isKind(statement, SyntaxKind.ExpressionStatement)) {
      continue;
    }

    const callExpression = statement.expression;
    if (!isKind(callExpression, SyntaxKind.CallExpression)) {
      continue;
    }

    if (!isKind(callExpression.expression, SyntaxKind.PropertyAccessExpression)) {
      continue;
    }

    const variableExpression = isKind(callExpression.expression.expression, SyntaxKind.Identifier);
    if (!variableExpression) {
      continue;
    }

    if (callExpression.expression.expression.text !== variableName) {
      continue;
    }

    lastExpression = statement;
  }

  if (!lastExpression) {
    return false;
  }

  const pos = lastExpression.getEnd();
  let prefix = content.substring(0, pos);
  let suffix = content.substring(pos);
  while (prefix.endsWith('\n') || prefix.endsWith('\r') || prefix.endsWith(' ')) {
    suffix = prefix[prefix.length - 1] + suffix;
    prefix = prefix.substr(0, prefix.length - 1);
  }

  fs.writeFileSync(schemaFilePath, `${prefix}\n${variableName}.migration(${migrationName});${suffix}`);
  return true;
}

export function writeMigration(migration: Migration<OrmSql>): string {
  const importStmt = factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports([
        factory.createImportSpecifier(false, undefined, factory.createIdentifier('MigrationDescription')),
      ]),
    ),
    factory.createStringLiteral('@daita/orm'),
  );

  const properties: PropertyAssignment[] = [
    factory.createPropertyAssignment(factory.createIdentifier('id'), factory.createStringLiteral(migration.id)),
  ];

  if (migration.after) {
    properties.push(
      factory.createPropertyAssignment(factory.createIdentifier('after'), factory.createStringLiteral(migration.after)),
    );
  }

  if (migration.resolve) {
    properties.push(
      factory.createPropertyAssignment(
        factory.createIdentifier('resolve'),
        factory.createStringLiteral(migration.resolve),
      ),
    );
  }

  properties.push(
    factory.createPropertyAssignment(
      factory.createIdentifier('steps'),
      factory.createArrayLiteralExpression(
        steps.map((step) => createExpressionFromValue(step)),
        true,
      ),
    ),
  );

  const exportStmt = factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(getMigrationName(migration.id)),
          undefined,
          factory.createTypeReferenceNode(factory.createIdentifier('MigrationDescription'), undefined),
          factory.createObjectLiteralExpression(properties, true),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  const sourceFile = createSourceFile(`${migration.id}.migration.ts`, '', ScriptTarget.Latest, false, ScriptKind.TS);
  const printer = createPrinter({
    newLine: NewLineKind.LineFeed,
  });

  const part1 = printer.printNode(EmitHint.Unspecified, importStmt, sourceFile);
  const part2 = printer.printNode(EmitHint.Unspecified, exportStmt, sourceFile);
  return `${part1}\n\n${part2}`;
}
