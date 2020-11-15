const Docker = require('dockerode');

module.exports = async function tearDown() {
  const docker = new Docker();
  const infos = await docker.listContainers();
  for (const info of infos) {
    if (info.Labels['ch.daita.source'] !== 'test') {
      continue;
    }

    const container = docker.getContainer(info.Id);
    await container.stop();
    await container.remove();
  }
};
