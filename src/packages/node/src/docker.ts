// import { Container } from 'dockerode';
// import Docker = require('dockerode');
// import { Defer } from '@daita/common';
import { request } from 'http';

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

export async function getDynamicPort(container: CreateContainerResult, containerPort: number): Promise<number> {
  const inspect = await inspectContainer(container.id);
  return inspect.networkSettings.ports[`${containerPort}/tcp`][0].hostPort;
}

//const docker = new Docker();

export async function runContainer(options: {
  image: string;
  env?: string[];
  labels?: { [key: string]: string };
  portBinding?: { [key: string]: number };
}) {
  //await pullImage(options.image);
  await createImage({
    fromImage: options.image,
  });

  // const hostConfig: Docker.HostConfig = { PortBindings: {} };
  // const exposedPorts: { [key: string]: any } = {};
  // if (options.portBinding) {
  //   for (const containerPort of Object.keys(options.portBinding)) {
  //     hostConfig.PortBindings[`${containerPort}/tcp`] = [{ HostPort: `${options.portBinding[containerPort]}` }];
  //     exposedPorts[`${containerPort}/tcp:`] = {};
  //   }
  // }
  // const container = await docker.createContainer({
  //   Image: options.image,
  //   Env: options.env,
  //   Labels: options.labels,
  //   HostConfig: hostConfig,
  //   ExposedPorts: exposedPorts,
  // });
  // await container.start();
  // return container;
  const container = await createContainer({
    env: options.env,
    image: options.image,
    labels: options.labels,
    portMappings: options.portBinding,
  });
  await startContainer(container.id);

  return container;
}
// export async function pullImage(imageName: string) {
//   const images = await docker.listImages({});
//   if (images.some((i) => i.RepoTags?.some((repoTag) => repoTag === imageName))) {
//     return;
//   }
//
//   const image = await docker.pull(imageName);
//   const pullDefer = new Defer<any>();
//   docker.modem.followProgress(image, (err: any, res: any) => (err ? pullDefer.reject(err) : pullDefer.resolve(res)));
//   await pullDefer.promise;
// }

export async function execCommand(containerId: string, cmd: string[]) {
  const exec = await createExec(containerId, {
    attachStderr: true,
    attachStdout: true,
    cmd,
  });
  return startExec(exec.id, {
    detach: false,
  });
  // const command = await container.exec({ Cmd: cmd, AttachStderr: true, AttachStdout: true });
  // const isReady = await command.start({});
  // const defer = new Defer<string>();
  // const chunks: Buffer[] = [];
  // isReady.on('data', (chunk) => chunks.push(chunk));
  // isReady.on('error', (err) => defer.reject(err));
  // isReady.on('end', () => {
  //   isReady.destroy();
  //   defer.resolve(Buffer.concat(chunks).toString());
  // });
  // return defer.promise;
}

export interface CreateContainerOptions {
  image: string;
  env?: string[];
  labels?: { [key: string]: string };
  portMappings?: { [key: number]: number };
}

export interface CreateContainerResult {
  id: string;
}

export interface ExecOptions {
  cmd: string[];
  env?: string[];
  tty?: boolean;
  priviledged?: boolean;
  user?: string;
  workingDir?: string;
  attachStdin?: boolean;
  attachStderr?: boolean;
  attachStdout?: boolean;
  detachKeys?: string;
}

export interface ExecResult {
  id: string;
}

export interface StartExecOptions {
  detach?: boolean;
  tty?: boolean;
}

export function startExec(id: string, options: StartExecOptions): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const clientRequest = request(
      {
        socketPath: '/var/run/docker.sock',
        path: `/exec/${id}/start`,
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      },
      (res) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('error', (data) => reject(data));
        res.on('end', () => {
          resolve(data);
        });
      },
    );

    clientRequest.write(
      JSON.stringify({
        Detach: options.detach,
        Tty: options.tty,
      }),
    );

    clientRequest.end();
  });
}

export interface ExecInspectResult {
  exitCode: number;
  containerId: string;
  canRemove: boolean;
  pid: number;
  running: boolean;
  openStdin: boolean;
  openStderr: boolean;
  openStdout: boolean;
  id: string;
  processConfig: {
    arguments: string[];
    entrypoint: string;
    privileged: boolean;
    tty: boolean;
    user: string;
  };
}

export interface CreateImageOptions {
  fromImage: string;
  // fromSrc?: string;
  // repo?: string;
  // tag?: string;
  // platform?: string;
}

export function createImage(options: CreateImageOptions): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const clientRequest = request(
      {
        socketPath: '/var/run/docker.sock',
        path: `/images/create?fromImage=${options.fromImage}`,
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      },
      (res) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('error', (data) => reject(data));
        res.on('end', () => {
          resolve();
        });
      },
    );

    clientRequest.end();
  });
}

export function inspectExec(id: string): Promise<ExecInspectResult> {
  return new Promise<ExecInspectResult>((resolve, reject) => {
    const clientRequest = request(
      {
        socketPath: '/var/run/docker.sock',
        path: `/exec/${id}/json`,
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      },
      (res) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('error', (data) => reject(data));
        res.on('end', () => {
          const result = JSON.parse(data);
          resolve({
            id: result.ID,
            canRemove: result.CanRemove,
            containerId: result.ContainerID,
            exitCode: result.ExitCode,
            openStderr: result.OpenStderr,
            openStdin: result.OpenStdin,
            openStdout: result.OpenStdout,
            pid: result.Pid,
            processConfig: result.ProcessConfig,
            running: result.Running,
          });
        });
      },
    );

    clientRequest.end();
  });
}

export function createExec(id: string, options: ExecOptions): Promise<ExecResult> {
  return new Promise<ExecResult>((resolve, reject) => {
    const clientRequest = request(
      {
        socketPath: '/var/run/docker.sock',
        path: `/containers/${id}/exec`,
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      },
      (res) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('error', (data) => reject(data));
        res.on('end', () => {
          const result = JSON.parse(data);
          resolve({
            id: result.Id,
          });
        });
      },
    );

    clientRequest.write(
      JSON.stringify({
        AttachStdin: options.attachStdin,
        AttachStdout: options.attachStdout,
        AttachStderr: options.attachStderr,
        DetachKeys: options.detachKeys,
        Tty: options.tty,
        Env: options.env,
        Cmd: options.cmd,
        Privileged: options.priviledged,
        User: options.user,
        WorkingDir: options.workingDir,
      }),
    );

    clientRequest.end();
  });
}

export function startContainer(id: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const clientRequest = request(
      {
        socketPath: '/var/run/docker.sock',
        path: `/containers/${id}/start`,
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      },
      (res) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('error', (data) => reject(data));
        res.on('end', () => {
          resolve();
        });
      },
    );

    clientRequest.end();
  });
}

export interface RemoveContainerOptions {
  v?: boolean;
  force?: boolean;
  link?: boolean;
}

export interface StopContainerOptions {
  timeout?: boolean;
}

export interface ContainerInspectResult {
  id: string;
  created: Date;
  name: string;
  image: string;
  restartCount: number;
  path: string;
  networkSettings: ContainerNetworkSettings;
}

export interface ContainerNetworkSettings {
  ports: ContainerNetworkSettingsPorts;
}

export interface ContainerNetworkSettingsPorts {
  [key: string]: { hostIp: string; hostPort: number }[];
}

export function inspectContainer(id: string) {
  return new Promise<ContainerInspectResult>((resolve, reject) => {
    const clientRequest = request(
      {
        socketPath: '/var/run/docker.sock',
        path: `/containers/${id}/json`,
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      },
      (res) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('error', (data) => reject(data));
        res.on('end', () => {
          const result = JSON.parse(data);
          resolve({
            id: result.Id,
            created: new Date(result.Created),
            name: result.Name,
            image: result.Image,
            restartCount: result.RestartCount,
            path: result.Path,
            networkSettings: {
              ports: Object.keys(result.NetworkSettings.Ports).reduce<ContainerNetworkSettingsPorts>((map, key) => {
                const value: any[] = result.NetworkSettings.Ports[key];
                if (value) {
                  map[key] = value.map((v) => ({ hostIp: v.HostIp, hostPort: parseInt(v.HostPort) }));
                }
                return map;
              }, {}),
            },
          });
        });
      },
    );

    clientRequest.end();
  });
}

export function stopContainer(id: string, options: StopContainerOptions) {
  return new Promise<void>((resolve, reject) => {
    const clientRequest = request(
      {
        socketPath: '/var/run/docker.sock',
        path: `/containers/${id}/stop?t=${options.timeout}`,
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      },
      (res) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('error', (data) => reject(data));
        res.on('end', () => {
          resolve();
        });
      },
    );

    clientRequest.end();
  });
}

export function removeContainer(id: string, options: RemoveContainerOptions) {
  return new Promise<void>((resolve, reject) => {
    const clientRequest = request(
      {
        socketPath: '/var/run/docker.sock',
        path: `/containers/${id}?force=${options.force}&v=${options.v}&link=${options.link}`,
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
      },
      (res) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('error', (data) => reject(data));
        res.on('end', () => {
          resolve();
        });
      },
    );

    clientRequest.end();
  });
}

export function createContainer(options: CreateContainerOptions) {
  return new Promise<CreateContainerResult>((resolve, reject) => {
    const hostConfig: { PortBindings: { [key: string]: { HostPort: string }[] } } = { PortBindings: {} };
    const exposedPorts: { [key: string]: any } = {};
    if (options.portMappings) {
      for (const [containerPort, hostPort] of Object.entries(options.portMappings)) {
        hostConfig.PortBindings[`${containerPort}/tcp`] = [{ HostPort: `${hostPort}` }];
        exposedPorts[`${containerPort}/tcp:`] = {};
      }
    }

    const clientRequest = request(
      {
        socketPath: '/var/run/docker.sock',
        path: '/containers/create',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      },
      (res) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('error', (data) => reject(data));
        res.on('end', () => {
          const result = JSON.parse(data);
          resolve({
            id: result.Id,
          });
        });
      },
    );

    clientRequest.write(
      JSON.stringify({
        Image: options.image,
        Env: options.env,
        Labels: options.labels,
        ExposedPorts: exposedPorts,
        HostConfig: hostConfig,
      }),
    );

    clientRequest.end();
  });
}
