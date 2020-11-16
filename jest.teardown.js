const Docker = require('dockerode');
async function tearDown() {
  const docker = new Docker();
  const infos = await docker.listContainers({ all: true, filters: { label: ['ch.daita.source=test'] } });
  for (const info of infos) {
    if (info.Labels['ch.daita.source'] !== 'test') {
      continue;
    }

    const container = docker.getContainer(info.Id);
    try {
      await container.stop();
    } catch (e) {
    } finally {
      await container.remove();
    }
  }
}

module.exports = tearDown;
