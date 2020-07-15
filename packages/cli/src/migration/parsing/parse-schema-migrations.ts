import { AstVariable } from '../../ast/ast-variable';
import { parseSchemaMigration } from './parse-schema-migration';
import { MigrationTree } from '@daita/orm';

export function parseSchemaMigrations(
  schemaVariable: AstVariable,
): MigrationTree {
  const migrationTree = new MigrationTree();

  for(const migrationCall of parseSchemaMigrationCalls(schemaVariable)) {
    const migrationVariable = migrationCall.variable;
    if (migrationVariable) {
      const init = migrationVariable.getInitializer();
      if (!init) {
        throw new Error('missing init for variable');
      }
      const migration = parseSchemaMigration(init);
      migrationTree.add(migration);
      continue;
    }

    const objectVariable = migrationCall.objectValue;
    if (objectVariable) {
      const migration = parseSchemaMigration(objectVariable);
      migrationTree.add(migration);
      continue;
    }

    throw new Error('unknown arg');
  }

  return migrationTree;
}

export function* parseSchemaMigrationCalls(schemaVariable: AstVariable) {
  const migrationCalls = schemaVariable.getCalls({ name: 'migration' });
  for (const migrationCall of migrationCalls) {
    const migrationClassArg = migrationCall.argument(0);
    if (!migrationClassArg) {
      throw new Error('missing first arg in migration');
    }
    yield migrationClassArg;
  }
}
