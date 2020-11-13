import { AstContext } from '../../ast/ast-context';
import { getSchemaInformation, getSchemaLocation } from '../../utils/path';
import { getContextFromConfig } from '../../utils/data-adapter';
import { isMigrationContext } from '../../../orm/context/get-migration-context';

export async function applyMigration(options: { cwd?: string; schema?: string; context?: string; migration?: string }) {
  const astContext = new AstContext();
  const schemaLocation = await getSchemaLocation(options);
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    console.warn('could not load schema');
    return;
  }

  const context = await getContextFromConfig(options, schemaInfo.getMigrationTree());
  if (!context) {
    console.error('could not create migration context');
    return;
  }

  if (!isMigrationContext(context)) {
    throw new Error('adpater does not support migrations');
  }

  await context.migrate({ targetMigration: options?.migration });
}
