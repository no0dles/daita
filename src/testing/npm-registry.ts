import { sleep } from '../packages/common/utils/sleep';
import { getRandomTestPort } from '../packages/node/random-port';
import { runContainer } from '../packages/node/docker';
import { waitForPort } from '../packages/node/network';
import { shell } from '../packages/node/command';

export interface NpmRegistry {
  uri: string;
  stop(): Promise<void>;
}

export async function getNpmRegistry(): Promise<NpmRegistry> {
  const newPort = getRandomTestPort();

  const image = 'verdaccio/verdaccio:4';
  const container = await runContainer({
    image,
    labels: {
      'ch.daita.source': 'test',
    },
    portBinding: { 4873: newPort },
  });
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
