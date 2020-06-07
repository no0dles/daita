import {Command, flags} from '@oclif/command';
import {getSchemaInformation, getSchemaLocation} from '../../utils/path';
import {getRelationalDataAdapter} from '../../utils/data-adapter';
import {AstContext} from '../../ast/ast-context';
import { getMigrationContext } from '@daita/orm';
import { getClient } from '@daita/relational/dist/client/get-client';

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

    const dataAdapter = await getRelationalDataAdapter(flags, this);
    if (!dataAdapter) {
      return;
    }

    const client = getClient(dataAdapter);
    const context = getMigrationContext(client, migrationTree);
    await context.update();
  }
}
