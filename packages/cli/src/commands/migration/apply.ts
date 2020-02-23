import {Command, flags} from '@oclif/command';
import {RelationalContext} from '@daita/core';
import {getSchemaInformation, getSchemaLocation} from '../../utils/path';
import {getRelationalDataAdapter} from '../../utils/data-adapter';
import {AstContext} from '../../ast/ast-context';

export default class Apply extends Command {
  static description = 'apply relational migrations';

  static flags = {
    schema: flags.string({
      char: 's',
      description: 'path to schema',
      default: 'src/schema.ts',
    }),
    migration: flags.string({char: 'm', description: 'migration id'}),
    cwd: flags.string({description: 'working directory', default: '.'}),
    context: flags.string({
      char: 'c',
      description: 'name of context',
      default: 'default',
    }),
  };

  static args = [];

  async run() {
    const {flags} = this.parse(Apply);
    const astContext = new AstContext();
    const schemaLocation = await getSchemaLocation(flags, this);
    const schemaInfo = await getSchemaInformation(astContext, schemaLocation, this);
    if (!schemaInfo) {
      this.warn('could not load schema');
      return;
    }

    const migrationTree = schemaInfo.getMigrationTree();
    const currentSchema = migrationTree.defaultSchema();

    const dataAdapter = getRelationalDataAdapter(flags, this);
    if (!dataAdapter) {
      return;
    }

    const context = new RelationalContext(
      currentSchema,
      migrationTree,
      dataAdapter,
      null,
    );
    await context.migration().apply();
  }
}
