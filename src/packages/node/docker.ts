import Docker from 'dockerode';
import { Defer } from '../common/utils/defer';

export interface DockerCompose {
  version: string;
  services?: { [key: string]: DockerComposeService };
  volumes?: { [key: string]: DockerComposeVolume };
}

export interface DockerComposeVolume {}

export interface DockerComposeService {
  image?: string;
  volumes?: string[];
  links?: string[];
  ports?: string[];
  environment?: string[];
}

export async function runContainer(options: {
  image: string;
  env?: string[];
  labels?: { [key: string]: string };
  portBinding?: { [key: string]: number };
}) {
  const docker = new Docker();

  await pullImage(options.image);

  const hostConfig: Docker.HostConfig = { PortBindings: {} };
  const exposedPorts: { [key: string]: {} } = {};
  if (options.portBinding) {
    for (const containerPort of Object.keys(options.portBinding)) {
      hostConfig.PortBindings[`${containerPort}/tcp`] = [{ HostPort: `${options.portBinding[containerPort]}` }];
      exposedPorts[`${containerPort}/tcp:`] = {};
    }
  }
  const container = await docker.createContainer({
    Image: options.image,
    Env: options.env,
    Labels: options.labels,
    HostConfig: hostConfig,
    ExposedPorts: exposedPorts,
  });
  await container.start();
  return container;
}
export async function pullImage(imageName: string) {
  const docker = new Docker();
  const image = await docker.pull(imageName);
  const pullDefer = new Defer<any>();
  docker.modem.followProgress(image, (err: any, res: any) => (err ? pullDefer.reject(err) : pullDefer.resolve(res)));
  await pullDefer.promise;
}

export async function execCommand(container: Docker.Container, cmd: string[]) {
  const command = await container.exec({ Cmd: cmd, AttachStderr: true, AttachStdout: true });
  const isReady = await command.start({});
  const defer = new Defer<string>();
  const chunks: Buffer[] = [];
  isReady.on('data', (chunk) => chunks.push(chunk));
  isReady.on('error', (err) => defer.reject(err));
  isReady.on('end', () => {
    defer.resolve(Buffer.concat(chunks).toString());
  });
  return defer.promise;
}
