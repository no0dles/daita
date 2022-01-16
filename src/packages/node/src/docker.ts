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

export async function runContainer(options: {
  image: string;
  env?: string[];
  labels?: { [key: string]: string };
  portBinding?: { [key: string]: number };
}) {
  await createImage({
    fromImage: options.image,
  });

  const container = await createContainer({
    env: options.env,
    image: options.image,
    labels: options.labels,
    portMappings: options.portBinding,
  });
  await startContainer(container.id);

  return container;
}

export async function execCommand(containerId: string, cmd: string[]) {
  const exec = await createExec(containerId, {
    attachStderr: true,
    attachStdout: true,
    cmd,
  });
  return startExec(exec.id, {
    detach: false,
  });
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
  fromSrc?: string;
  repo?: string;
  tag?: string;
  platform?: string;
}

function buildQuery(query: { [key: string]: string | boolean | undefined | null | number }): string {
  const keys = Object.keys(query).filter((key) => query[key] !== undefined && query[key] !== null);
  if (keys.length === 0) {
    return '';
  }
  return '?' + keys.map((key) => `${key}=${query[key]}`).join('&');
}

function handleRequest<T>(
  options: { method: 'GET' | 'POST' | 'DELETE'; path: string },
  responseHandlers: { [key: number]: (responseData: string) => T | Error },
  data?: any,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const clientRequest = request(
      {
        socketPath: '/var/run/docker.sock',
        path: options.path,
        method: options.method,
        headers: { 'content-type': 'application/json' },
      },
      (res) => {
        const responseHandler = responseHandlers[res.statusCode || 0];
        if (!responseHandler) {
          reject(new Error(`unexpected http response ${res.statusCode} for ${options.method} ${options.path}`));
        } else {
          res.setEncoding('utf8');
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('error', (data) => reject(data));
          res.on('end', () => {
            const result = responseHandler(data);
            if (result instanceof Error) {
              reject(result);
            } else {
              resolve(result);
            }
          });
        }
      },
    );

    if (data) {
      clientRequest.write(JSON.stringify(data));
    }

    clientRequest.end();
  });
}

export interface RemoveContainerOptions {
  removeVolumes?: boolean;
  force?: boolean;
  removeLinks?: boolean;
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

export function createImage(options: CreateImageOptions): Promise<void> {
  return handleRequest<void>(
    {
      path: `/images/create${buildQuery({
        fromImage: options.fromImage,
        fromSrc: options.fromSrc,
        repo: options.repo,
        tag: options.tag,
        platform: options.platform,
      })}`,
      method: 'POST',
    },
    {
      200: () => {},
      404: () => new Error('repository does not exist or no read access'),
      500: () => new Error('server error'),
    },
  );
}

export function inspectExec(id: string): Promise<ExecInspectResult> {
  return handleRequest<ExecInspectResult>(
    {
      path: `/exec/${id}/json`,
      method: 'GET',
    },
    {
      200: (data) => {
        const result = JSON.parse(data);
        return {
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
        };
      },
      404: () => new Error('no such exec instance'),
      500: () => new Error('server error'),
    },
  );
}

export function createExec(id: string, options: ExecOptions): Promise<ExecResult> {
  return handleRequest<ExecResult>(
    {
      path: `/containers/${id}/exec`,
      method: 'POST',
    },
    {
      201: (data) => {
        const result = JSON.parse(data);
        return {
          id: result.Id,
        };
      },
      404: () => new Error('no such container'),
      409: () => new Error('container is paused'),
      500: () => new Error('server error'),
    },
    {
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
    },
  );
}

export function startContainer(id: string): Promise<void> {
  return handleRequest<void>(
    {
      path: `/containers/${id}/start`,
      method: 'POST',
    },
    {
      204: () => {},
      304: () => {},
      404: () => new Error('no such container'),
      500: () => new Error('server error'),
    },
  );
}

export function inspectContainer(id: string) {
  return handleRequest<ContainerInspectResult>(
    {
      path: `/containers/${id}/json`,
      method: 'GET',
    },
    {
      200: (data) => {
        const result = JSON.parse(data);
        return {
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
        };
      },
      404: () => new Error('no such container'),
      500: () => new Error('server error'),
    },
  );
}

export function stopContainer(id: string, options: StopContainerOptions) {
  return handleRequest<void>(
    {
      path: `/containers/${id}/stop${buildQuery({ t: options.timeout })}`,
      method: 'POST',
    },
    {
      204: () => {},
      304: () => {},
      404: () => new Error('no such container'),
      500: () => new Error('server error'),
    },
  );
}

export function removeContainer(id: string, options: RemoveContainerOptions) {
  return handleRequest<void>(
    {
      path: `/containers/${id}${buildQuery({
        force: options.force,
        v: options.removeVolumes,
        link: options.removeLinks,
      })}`,
      method: 'DELETE',
    },
    {
      204: () => {},
      400: () => new Error('bad parameter'),
      404: () => new Error('no such container'),
      409: () => new Error('conflict'),
      500: () => new Error('server error'),
    },
  );
}

export function createContainer(options: CreateContainerOptions) {
  const hostConfig: { PortBindings: { [key: string]: { HostPort: string }[] } } = { PortBindings: {} };
  const exposedPorts: { [key: string]: any } = {};
  if (options.portMappings) {
    for (const [containerPort, hostPort] of Object.entries(options.portMappings)) {
      hostConfig.PortBindings[`${containerPort}/tcp`] = [{ HostPort: `${hostPort}` }];
      exposedPorts[`${containerPort}/tcp:`] = {};
    }
  }

  return handleRequest<CreateContainerResult>(
    {
      path: '/containers/create',
      method: 'POST',
    },
    {
      201: (data) => {
        const result = JSON.parse(data);
        return {
          id: result.Id,
        };
      },
      400: () => new Error('bad parameter'),
      404: () => new Error('no such container'),
      409: () => new Error('conflict'),
      500: () => new Error('server error'),
    },
    {
      Image: options.image,
      Env: options.env,
      Labels: options.labels,
      ExposedPorts: exposedPorts,
      HostConfig: hostConfig,
    },
  );
}
