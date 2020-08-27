import * as Docker from 'dockerode';
import { Defer } from '../../../common/src/utils';
import { ContainerInspectInfo } from 'dockerode';
import { spawn } from 'child_process';

const docker = new Docker();

export interface ContainerArgument {
  containerName: string,
  image: string,
  envs: string[],
  ports: { [key: string]: string }
}

export async function startContainer(arg: ContainerArgument) {
  await pullImage(arg.image);

  console.log('start container');
  const exposedPorts: any = {};
  const portBindings: any = {};
  for (const key of Object.keys(arg.ports)) {
    exposedPorts[`${key}/tcp:`] = {};
    portBindings[`${key}/tcp`] = [{ HostPort: key }];
  }
  const newContainer = await docker.createContainer({
    name: arg.containerName,
    Image: arg.image,
    Env: arg.envs,
    ExposedPorts: exposedPorts,
    HostConfig: {
      PortBindings: portBindings,
    },
  });
  console.log('created container');
  await newContainer.start({});
  console.log('started container');
}

export async function removeContainer(containerName: string) {
  console.log('remove container', containerName);
  const containers = await docker.listContainers({ all: true });
  const container = containers.filter(c => c.Names[0] === `/${containerName}`)[0];
  if (!container) {
    return;
  }
  await removeContainerById(container.Id);
}

export async function removeContainerById(id: string) {
  console.log('remove container by id', id);
  const existingContainer = docker.getContainer(id);
  const defer = new Defer<void>();
  await existingContainer.remove({force: true}, () => defer.resolve());
  await defer.promise;
}

export function inspectContainer(id: string) {
  const defer = new Defer<ContainerInspectInfo>();
  docker.getContainer(id).inspect((err, res) => {
    if(err) {
      defer.reject(err);
    } else {
      defer.resolve(res);
    }
  });
  return defer.promise;
}

export async function ensureContainerIsRunning(arg: ContainerArgument) {
  console.log('ensure container is running');
  const containers = await docker.listContainers({ all: true });
  const container = containers.filter(c => c.Names[0] === `/${arg.containerName}`)[0];
  if (container) {
    const inspect = await inspectContainer(container.Id);
    // inspect.HostConfig.PortBindings
    // if (container.Image === arg.image) { // TODO compare ports/env
    //   return;
    // }
    await removeContainerById(container.Id);
  }
  await startContainer(arg);
}

export async function pullImage(image: string) {
  console.log('pull image', image);
  const pullDefer = new Defer<void>();
  const stream = await docker.pull(image);
  stream.pipe(process.stdout);
  docker.modem.followProgress(stream, (err: any, res: any) => {
    if (err) {
      pullDefer.reject(err);
    } else {
      pullDefer.resolve(res);
    }
  });
  await pullDefer.promise;
}

export async function run(cmd: string, args: string[], cwd: string) {
  return new Promise(((resolve, reject) => {
    const ps = spawn(cmd, args, { cwd, stdio: [process.stdin, process.stdout, process.stderr] });
    ps.once('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  }));
}

async function main() {
  await ensureContainerIsRunning({
    image: 'verdaccio/verdaccio',
    ports: {
      '4873': '4873',
    },
    containerName: 'npm',
    envs: [],
  });

  await run('node_modules/.bin/lerna', ['publish', 'from-package', '--registry', 'http://localhost:4873', '-y'], '/Users/pascal/Repos/node-daita');
}

ensureContainerIsRunning({
  image: 'postgres',
  ports: {
    '5434': '5432',
  },
  containerName: 'db',
  envs: [
    'POSTGRES_USER=postgres',
    'POSTGRES_PASSWORD=postgres',
    'POSTGRES_DB=postgres',
  ],
});

main();
