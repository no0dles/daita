import { listContainers, removeContainer } from './src/packages/node/src';

async function tearDown() {
  const containers = await listContainers({
    all: true,
    filters: {
      label: ['ch.daita.source=test'],
    },
  });
  for (const container of containers) {
    await removeContainer(container.id, { force: true, removeLinks: true, removeVolumes: true });
  }
}

module.exports = tearDown;
