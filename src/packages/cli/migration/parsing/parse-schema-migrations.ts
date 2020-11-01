import { parseSchemaMigration } from './parse-schema-migration';
import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { getObjectValue } from '../../ast/utils';
import { parseRelationalSchemaName } from './parse-relational-schema';
import { MigrationTree } from '../../../orm/migration/migration-tree';

export function parseSchemaMigrations(schemaVariable: AstVariableDeclaration): MigrationTree {
  const nameValue = parseRelationalSchemaName(schemaVariable);
  const migrationTree = new MigrationTree(nameValue);

  for (const migrationCall of parseSchemaMigrationCalls(schemaVariable)) {
    const migration = parseSchemaMigration(migrationCall);
    migrationTree.add(migration);
  }

  return migrationTree;
}

export function* parseSchemaMigrationCalls(schemaVariable: AstVariableDeclaration) {
  const migrationCalls = schemaVariable.callsByName('migration');
  for (const migrationCall of migrationCalls) {
    const migrationClassArg = migrationCall.argumentAt(0);
    if (!migrationClassArg) {
      throw new Error('missing first arg in migration');
    }

    yield getObjectValue(migrationClassArg);
  }
}

export function* parseSchemaMigrationVariables(schemaVariable: AstVariableDeclaration) {
  const migrationCalls = schemaVariable.callsByName('migration');
  for (const migrationCall of migrationCalls) {
    const migrationClassArg = migrationCall.argumentAt(0);
    if (!migrationClassArg) {
      throw new Error('missing first arg in migration');
    }

    if (migrationClassArg instanceof AstVariableDeclaration) {
      yield migrationClassArg;
    }
  }
}
