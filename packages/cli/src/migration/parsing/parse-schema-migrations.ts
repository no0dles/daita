import {AstVariable} from '../../ast/ast-variable';
import {parseSchemaMigration} from './parse-schema-migration';
import {parseSchemaMigrationVariables} from './parse-schema-migration-variables';
import { MigrationTree } from '@daita/orm';

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
