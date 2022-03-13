import { listContainers, removeContainer } from './src/packages/node/src';

async function tearDown() {
  const containers = await listContainers({
    all: true,
    filters: {
      label: ['ch.daita.source=test'],
    },
  });

  for (const container of containers) {
    try {
      console.log('remove container ' + container.id);
      await removeContainer(container.id, { force: true, removeLinks: false, removeVolumes: true });
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = tearDown;
