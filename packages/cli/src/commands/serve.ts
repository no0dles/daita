import * as path from "path";
import { getRelationalDataAdapter } from '../utils/data-adapter';
import { createHttpServer } from '@daita/http-server';

export async function serve(opts: {cwd?: string, schema?: string, port?: number}) {
  process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';
  if (opts.cwd) {
    process.env.NODE_CONFIG_DIR = path.join(opts.cwd, 'config');
  }

  const dataAdapter = await getRelationalDataAdapter(opts);
  if (!dataAdapter) {
    throw new Error('no relational adapter');
  }

  const app = createHttpServer({
    dataAdapter,
    rules: [],
    cors: true,
  });

  const port = opts.port || 8765;
  const server = app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
  });

  process.on('SIGINT', () => {
    console.log('stopping http server');
    server?.close();
    dataAdapter?.close();
  });
}
