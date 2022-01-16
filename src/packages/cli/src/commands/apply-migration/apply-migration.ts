import { AstContext } from '../../ast/ast-context';
import { getSchemaInformation, getSchemaLocation } from '../../utils/path';
import { getContextFromConfig } from '../../utils/data-adapter';
import { migrate } from '@daita/orm';

export async function applyMigration(options: { cwd?: string; schema?: string; context?: string; migration?: string }) {
  const astContext = new AstContext();
  const schemaLocation = await getSchemaLocation(options);
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    throw new Error('could not load schema');
  }

  const context = await getContextFromConfig(options);
  if (!context) {
    throw new Error('could not create migration context');
  }

  await migrate(context, schemaInfo.getMigrationTree(), { targetMigration: options?.migration });
}
