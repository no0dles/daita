import Docker from 'dockerode';
import { Defer } from '../packages/common/utils/defer';
import net from 'net';
import { sleep } from '../packages/common/utils/sleep';
import { randomNumber } from '../packages/common/utils/random-string';

const minPort = 49152;
const maxPort = 65535;

export function getRandomTestPort() {
  return randomNumber(minPort, maxPort);
}

export async function getFreeTestPort() {
  let port = getRandomTestPort();
  while (await isPortInUse(port)) {
    port = getRandomTestPort();
  }
  return port;
}

export function isPortInUse(port: number) {
  const defer = new Defer<boolean>();
  const server = net.createServer((socket) => {
    socket.write('Echo server\r\n');
    socket.pipe(socket);
  });

  server.listen(port, '127.0.0.1');
  server.on('error', () => {
    defer.resolve(true);
  });
  server.on('listening', () => {
    server.close();
    defer.resolve(false);
  });
  return defer.promise;
}

async function pullImage(docker: Docker, imageName: string) {
  const image = await docker.pull(imageName);
  const pullDefer = new Defer<any>();
  docker.modem.followProgress(image, (err: any, res: any) => (err ? pullDefer.reject(err) : pullDefer.resolve(res)));
  await pullDefer.promise;
}

export interface PostgresDb {
  connectionString: string;
  close(): Promise<void>;
}

function waitForPort(port: number) {
  const defer = new Defer<void>();
  const client = net.createConnection({ port }, () => {
    console.log('port is open');
  });
  client.on('data', (data) => {
    console.log(data.toString());
    defer.resolve();
    client.end();
  });
  client.on('error', (e) => {
    console.log(e);
    defer.reject(e);
  });
  return defer.promise;
}

export async function getPostgresDb(): Promise<PostgresDb> {
  const docker = new Docker();
  const newPort = getRandomTestPort();

  await pullImage(docker, 'postgres:12');

  const container = await docker.createContainer({
    Image: 'postgres:12',
    Env: ['POSTGRES_PASSWORD=postgres'],
    Labels: {
      'ch.daita.source': 'test',
    },
    HostConfig: {
      PortBindings: {
        '5432/tcp': [{ HostPort: `${newPort}` }],
      },
    },
    ExposedPorts: {
      '5432/tcp:': {},
    },
  });
  await container.start();

  let isReady = await execCommand(container, ['pg_isready']);
  while (isReady.indexOf('accepting connections') === -1) {
    await sleep(500);
    isReady = await execCommand(container, ['pg_isready']);
  }
  //TODO figure out why connect does not work after pg_isready
  await sleep(200);

  const db: PostgresDb = {
    connectionString: `postgres://postgres:postgres@localhost:${newPort}/postgres`,
    close: async () => {
      await container.stop();
      await container.remove();
    },
  };
  return db;
}

async function execCommand(container: Docker.Container, cmd: string[]) {
  const command = await container.exec({ Cmd: cmd, AttachStderr: true, AttachStdout: true });
  const isReady = await command.start({});
  const defer = new Defer<string>();
  const chunks: Buffer[] = [];
  isReady.on('data', (chunk) => chunks.push(chunk));
  isReady.on('error', (err) => defer.reject(err));
  isReady.on('end', () => {
    defer.resolve(Buffer.concat(chunks).toString());
  });
  return defer.promise;
}
