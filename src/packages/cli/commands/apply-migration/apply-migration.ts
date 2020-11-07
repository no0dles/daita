import { AstContext } from '../../ast/ast-context';
import { getSchemaInformation, getSchemaLocation } from '../../utils/path';
import { getMigrationContextFromConfig } from '../../utils/data-adapter';

export async function applyMigration(options: { cwd?: string; schema?: string; context?: string; migration?: string }) {
  const astContext = new AstContext();
  const schemaLocation = await getSchemaLocation(options);
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    console.warn('could not load schema');
    return;
  }

  const migrationTree = schemaInfo.getMigrationTree();

  const context = await getMigrationContextFromConfig(migrationTree, options);
  if (!context) {
    console.error('could not create migration context');
    return;
  }

  await context.update({ targetMigration: options?.migration });
}
