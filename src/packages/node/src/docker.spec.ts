import {
  createContainer,
  createExec,
  createImage,
  inspectContainer,
  removeContainer,
  startContainer,
  startExec,
} from './docker';

describe('node/docker', () => {
  it('should create', async () => {
    await createImage({
      fromImage: 'library/postgres:12',
    });

    const container = await createContainer({
      image: 'postgres:12',
      env: ['POSTGRES_PASSWORD=postgres'],
      labels: {
        'ch.daita.source': 'test',
      },
      portMappings: { 5432: 0 },
    });
    expect(container.id).not.toBeNull();
    expect(container.id).not.toBeUndefined();

    await startContainer(container.id);

    const inspect = await inspectContainer(container.id);

    expect(inspect.id).toBe(container.id);

    const exec = await createExec(container.id, {
      cmd: ['pg_isready'],
      attachStdout: true,
    });

    await startExec(exec.id, {
      detach: false,
    });

    await removeContainer(container.id, { force: true });
  });
});
