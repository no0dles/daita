import { Command, flags } from '@oclif/command';
import { getSchemaInformation, getSchemaLocation } from '../utils/path';
import { getRelationalDataAdapter } from '../utils/data-adapter';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as path from 'path';
import * as http from 'http';
import { getApp } from '@daita/web';
import { getMigrationSchema } from '@daita/core/dist/schema/migration-schema-builder';
import {Debouncer, RelationalContext} from '@daita/core';

export default class Serve extends Command {
  static description = 'serve api';

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
    watch: flags.boolean({
      char: 'w',
      description: 'watch for reload',
      default: false,
    }),
  };

  async run() {
    const { flags } = this.parse(Serve);
    const schemaLocation = await getSchemaLocation(flags, this);

    const dataAdapter = getRelationalDataAdapter(flags, this);
    if (!dataAdapter) {
      throw new Error('no relational adapter');
    }
    const watchPaths = [schemaLocation.sourceDirectory];

    let currentPath = process.cwd();
    const pathParts = path.dirname(process.cwd()).split(path.sep);
    for (let i = 0; i < pathParts.length + 1; i++) {
      const nodePath = path.join(currentPath, 'node_modules');
      if (fs.existsSync(nodePath)) {
        watchPaths.push(nodePath);
      }
      currentPath = path.resolve(currentPath, '..');
    }

    let server: http.Server | null = null;
    const debouncer = new Debouncer(async () => {
      if (server) {
        server.close();
      }

      const schemaInfo = await getSchemaInformation(schemaLocation, this);
      if (!schemaInfo) {
        this.warn(`could not load schema`);
        return;
      }

      const lastMigrations = schemaInfo.migrationTree.last();
      if (lastMigrations.length > 1) {
        throw new Error('multiple migrations');
      } else if (lastMigrations.length === 0) {
        throw new Error('no migrations');
      }
      const schema = getMigrationSchema(
        schemaInfo.migrationTree.path(lastMigrations[0].id),
      );
      const context = new RelationalContext(
        schema,
        schemaInfo.migrationTree,
        dataAdapter,
      );
      await context.migration().apply();

      const app = getApp({
        dataAdapter,
        migrationTree: schemaInfo.migrationTree,
      });
      server = app.listen(8765, () => {
        this.debug('listening on port 8765');
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
