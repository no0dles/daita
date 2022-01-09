import { sleep } from '@daita/common';
import { getDynamicPort, removeContainer, runContainer } from '@daita/node';
import { waitForPort } from '@daita/node';
import { shell } from '@daita/node';

export interface NpmRegistry {
  uri: string;
  stop(): Promise<void>;
}

export async function getNpmRegistry(): Promise<NpmRegistry> {
  const image = 'verdaccio/verdaccio:4';
  const container = await runContainer({
    image,
    labels: {
      'ch.daita.source': 'test',
    },
    portBinding: { 4873: 0 },
  });
  const newPort = await getDynamicPort(container, 4873);
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
      await removeContainer(container.id, { force: true });
    },
  };
}
