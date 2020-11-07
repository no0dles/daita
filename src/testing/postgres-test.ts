import Docker from 'dockerode';
import { Defer } from '../packages/common/utils/defer';
import net from 'net';
import { sleep } from '../packages/common/utils/sleep';

const minPort = 49152;
const maxPort = 65535;

export function getRandomTestPort() {
  return Math.floor(Math.random() * (maxPort - minPort)) + minPort;
}

async function pullImage(docker: Docker, imageName: string) {
  const image = await docker.pull(imageName);
  const pullDefer = new Defer<any>();
  docker.modem.followProgress(image, (err: any, res: any) => (err ? pullDefer.reject(err) : pullDefer.resolve(res)));
  await pullDefer.promise;
}

export interface PostgresDb {
  connectionString: string;
  start(): Promise<PostgresDb>;
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

export function getPostgresDb(): PostgresDb {
  const docker = new Docker();
  const newPort = getRandomTestPort();

  let container: Docker.Container;

  const db: PostgresDb = {
    connectionString: `postgres://postgres:postgres@localhost:${newPort}/postgres`,
    start: async () => {
      await pullImage(docker, 'postgres:12');

      container = await docker.createContainer({
        Image: 'postgres:12',
        Env: ['POSTGRES_PASSWORD=postgres'],
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
        await sleep(200);
        isReady = await execCommand(container, ['pg_isready']);
      }

      return db;
    },
    close: async () => {
      await container.stop();
      await container.remove();
    },
  };
  return db;
}

async function execCommand(container: Docker.Container, cmd: string[]) {
  const command = await container.exec({ Cmd: ['pg_isready'], AttachStderr: true, AttachStdout: true });
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
