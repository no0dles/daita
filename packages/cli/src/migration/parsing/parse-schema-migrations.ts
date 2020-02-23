import {AstVariable} from '../../ast/ast-variable';
import {MigrationTree} from '@daita/core';
import {parseSchemaMigration} from './parse-schema-migration';
import {parseSchemaMigrationVariables} from './parse-schema-migration-variables';

export function parseSchemaMigrations(
  schemaVariable: AstVariable,
): MigrationTree {
  const migrationTree = new MigrationTree();

  const migrationVariables = parseSchemaMigrationVariables(schemaVariable);
  for (const migrationVariable of migrationVariables) {
    const migration = parseSchemaMigration(migrationVariable);
    migrationTree.add(migration);
  }

  return migrationTree;
}
