import { AstContext } from '../ast/ast-context';
import { getSchemaInformation, getSchemaLocation } from '../utils/path';
import { getClientFromConfig } from '../utils/data-adapter';
import { getMigrationContext } from '../../orm/context/get-migration-context';

export async function applyMigration(options: { cwd?: string; schema?: string; context?: string }) {
  const astContext = new AstContext();
  const schemaLocation = await getSchemaLocation(options);
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    console.warn('could not load schema');
    return;
  }

  const migrationTree = schemaInfo.getMigrationTree();

  const client = await getClientFromConfig(options);
  if (!client) {
    return;
  }

  const context = getMigrationContext(client, migrationTree);
  await context.update();
  await client.close();
}
