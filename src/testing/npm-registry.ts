import { getRandomTestPort, pullImage, waitForPort } from './postgres-test';
import Docker from 'dockerode';
import { shell } from '../scripts/shell';
import { sleep } from '../packages/common/utils/sleep';

export interface NpmRegistry {
  uri: string;
  stop(): Promise<void>;
}

export async function getNpmRegistry(): Promise<NpmRegistry> {
  const docker = new Docker();
  const newPort = getRandomTestPort();

  const image = 'verdaccio/verdaccio:4';
  await pullImage(docker, image);

  const container = await docker.createContainer({
    Image: image,
    Env: [],
    Labels: {
      'ch.daita.source': 'test',
    },
    HostConfig: {
      PortBindings: {
        '4873/tcp': [{ HostPort: `${newPort}` }],
      },
    },
    ExposedPorts: {
      '4873/tcp:': {},
    },
  });
  await container.start();
  await waitForPort(newPort);
  await sleep(500);

  await shell('npm', ['adduser', '--registry', `http://localhost:${newPort}`], process.cwd(), {
    stdIn: (output: string) => {
      if (output === 'Username: ') {
        return 'daita\n';
      } else if (output === 'Password: ') {
        return 'daita\n';
      } else if (output === 'Email: (this IS public) ') {
        return 'dev@daita.ch\n';
      }
      return null;
    },
  });

  return {
    uri: `http://localhost:${newPort}`,
    stop: async () => {
      await container.stop();
      await container.remove();
    },
  };
}
