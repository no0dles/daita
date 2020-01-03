import { Command, flags } from '@oclif/command';
import { getMigrationSchema } from '@daita/core/dist/schema/migration-schema-builder';
import { RelationalContext, RelationalDataAdapter } from '@daita/core';
import { getSchemaInformation, getSchemaLocation } from '../../utils/path';
import { getRelationalDataAdapter } from '../../utils/data-adapter';

export default class Apply extends Command {
  static description = 'apply relational migrations';

  static flags = {
    schema: flags.string({
      char: 's',
      description: 'path to schema',
      default: 'src/schema.ts',
    }),
    migration: flags.string({ char: 'm', description: 'migration id' }),
    context: flags.string({
      char: 'c',
      description: 'name of context',
      default: 'default',
    }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(Apply);
    const schemaLocation = await getSchemaLocation(flags, this);
    const schemaInfo = await getSchemaInformation(schemaLocation, this);
    if (!schemaInfo) {
      this.warn('could not load schema');
      return;
    }

    const last = schemaInfo.migrationTree.last();
    if (last.length === 0) {
      throw new Error('not migrations yet');
    }
    if (last.length > 1) {
      throw new Error('more than 1 migration');
    }

    const dataAdapter = getRelationalDataAdapter(flags, this);
    if (!dataAdapter) {
      return;
    }

    const migrationSchema = getMigrationSchema(
      schemaInfo.migrationTree.path(last[0].id),
    );
    const context = new RelationalContext(
      migrationSchema,
      schemaInfo.migrationTree,
      dataAdapter,
    );
    await context.migration().apply();
  }
}
