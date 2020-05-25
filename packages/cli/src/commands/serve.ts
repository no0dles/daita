import {Command, flags} from '@oclif/command';
import {getRelationalDataAdapter} from '../utils/data-adapter';
import * as path from 'path';
import * as http from 'http';
import {createHttpServer } from '@daita/http-server';

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
    const parsed = this.parse(Serve);

    process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';
    if (parsed.flags.cwd) {
      process.env.NODE_CONFIG_DIR = path.join(parsed.flags.cwd, 'config');
    }

    const dataAdapter = await getRelationalDataAdapter(parsed.flags, this);
    if (!dataAdapter) {
      throw new Error('no relational adapter');
    }

    const app = createHttpServer({
      dataAdapter,
    });

    const port = parsed.flags.port || 8765;
    this.server = app.listen(port, () => {
      console.log('listening')
      this.log(`listening on http://localhost:${port}`);
    });

    process.on('SIGINT', () => {
      this.log("stopping http server");
      this.server?.close();
    });

    //const schemaLocation = await getSchemaLocation(parsed.flags, this);
    //const tokenProvider = getTokenProvider(parsed.flags, this);

    // const watchPaths = [schemaLocation.sourceDirectory];
    //
    // let currentPath = parsed.flags.cwd ? path.resolve(parsed.flags.cwd) : process.cwd();
    // const pathParts = path.dirname(currentPath).split(path.sep);
    // for (let i = 0; i < pathParts.length + 1; i++) {
    //   const nodePath = path.join(currentPath, 'node_modules');
    //   if (fs.existsSync(nodePath)) {
    //     watchPaths.push(nodePath);
    //   }
    //   currentPath = path.resolve(currentPath, '..');
    // }
    //

    // const debouncer = new Debouncer(async () => {
    //   // const userProvider = {
    //   //   get: async (token: AccessToken) => {
    //   //     throw new Error('not found');
    //   //   },
    //   // };
    //
    //
    // }, 200);
    //
    // const watcher = chokidar.watch(watchPaths, {
    //   followSymlinks: true,
    //   ignored: /^(.[ts|js])$/,
    // });
    // watcher.on('change', () => {
    //   debouncer.bounce();
    // });
    // watcher.on('add', () => {
    //   debouncer.bounce();
    // });
    // watcher.on('unlink', () => {
    //   debouncer.bounce();
    // });
  }
}
