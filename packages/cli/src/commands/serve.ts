import {Command, flags} from '@oclif/command';
import {getSchemaInformation, getSchemaLocation} from '../utils/path';
import {getRelationalDataAdapter} from '../utils/data-adapter';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as path from 'path';
import * as http from 'http';
import {getApp} from '@daita/web';
import {Debouncer, RelationalContext} from '@daita/core';
import {getTokenProvider} from '../utils/token-provider';
import {AccessToken} from '@daita/web/dist/auth/token-provider';
import {AstContext} from '../ast/ast-context';

export default class Serve extends Command {
  private server: http.Server | null = null;

  static description = 'serve daita api';

  static flags = {
    schema: flags.string({
      char: 's',
      description: 'path to schema',
      default: 'src/schema.ts',
    }),
    cwd: flags.string({description: 'working directory', default: '.'}),
    migration: flags.string({char: 'm', description: 'migration id'}),
    context: flags.string({
      char: 'c',
      description: 'name of context',
      default: 'default',
    }),
    port: flags.integer({char: 'p', description: 'application port', default: 8765}),
    watch: flags.boolean({
      char: 'w',
      description: 'watch for reload',
      default: false,
    }),
  };

  async run() {
    const {flags} = this.parse(Serve);
    const schemaLocation = await getSchemaLocation(flags, this);


    process.env['SUPPRESS_NO_CONFIG_WARNING'] = 'true';
    if (flags.cwd) {
      process.env['NODE_CONFIG_DIR'] = path.join(flags.cwd, 'config');
    }

    const dataAdapter = getRelationalDataAdapter(flags, this);
    if (!dataAdapter) {
      throw new Error('no relational adapter');
    }

    const tokenProvider = getTokenProvider(flags, this);

    const watchPaths = [schemaLocation.sourceDirectory];

    let currentPath = flags.cwd ? path.resolve(flags.cwd) : process.cwd();
    const pathParts = path.dirname(currentPath).split(path.sep);
    for (let i = 0; i < pathParts.length + 1; i++) {
      const nodePath = path.join(currentPath, 'node_modules');
      if (fs.existsSync(nodePath)) {
        watchPaths.push(nodePath);
      }
      currentPath = path.resolve(currentPath, '..');
    }

    const debouncer = new Debouncer(async () => {
      if (this.server) {
        this.server.close();
      }

      const astContext = new AstContext();
      const schemaInfo = await getSchemaInformation(astContext, schemaLocation, this);
      if (!schemaInfo) {
        this.warn(`could not load schema`);
        return;
      }

      const migrationTree = schemaInfo.getMigrationTree();
      const schema = migrationTree.defaultSchema();
      const context = new RelationalContext(
        schema,
        migrationTree,
        dataAdapter,
        null,
      );
      await context.migration().apply();
      const userProvider = {
        get: async (token: AccessToken) => {
          throw new Error('not found');
        },
      };

      const app = getApp({
        type: 'migrationTree',
        dataAdapter,
        migrationTree: migrationTree,
        auth: tokenProvider ? {
          tokenProvider,
          userProvider,
        } : undefined,
      });

      const port = flags.port || 8765;
      this.server = app.listen(port, () => {
        this.log(`listening on http://localhost:${port}`);
      });
    }, 200);

    const watcher = chokidar.watch(watchPaths, {
      followSymlinks: true,
      ignored: /^(.[ts|js])$/,
    });
    watcher.on('change', path => {
      debouncer.bounce();
    });
    watcher.on('add', path => {
      debouncer.bounce();
    });
    watcher.on('unlink', path => {
      debouncer.bounce();
    });
  }
}
