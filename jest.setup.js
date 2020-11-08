const Docker = require('dockerode');

const docker = new Docker();
docker.listContainers(async (err, infos) => {
  const now = new Date().getTime() / 1000;
  for (const info of infos) {
    // do not kill new containers
    if (info.Created < now - 20) {
      continue;
    }

    if (info.Labels['ch.daita.source'] !== 'test') {
      continue;
    }

    const container = docker.getContainer(info.Id);
    await container.stop();
    await container.remove();
  }
});
