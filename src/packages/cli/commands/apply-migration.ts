import { AstContext } from '../ast/ast-context';
import { getSchemaInformation, getSchemaLocation } from '../utils/path';
import { getRelationalDataAdapter } from '../utils/data-adapter';
import {getMigrationContext} from '../../orm/context';
import {getClient} from '../../relational/client';

export async function applyMigration(options: { cwd?: string, schema?: string, context?: string }) {
  const astContext = new AstContext();
  const schemaLocation = await getSchemaLocation(options);
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    console.warn('could not load schema');
    return;
  }

  const migrationTree = schemaInfo.getMigrationTree();

  const dataAdapter = await getRelationalDataAdapter(options);
  if (!dataAdapter) {
    return;
  }

  const client = getClient(dataAdapter);
  const context = getMigrationContext(client, migrationTree);
  await context.update();
  await dataAdapter.close();
}
