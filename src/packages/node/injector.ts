import { Constructable } from '../common/types/constructable';
import { Defer } from '../common/utils/defer';
import { createServer } from 'http';

export interface OnStartup {
  onStartup(): Promise<void> | void;
}

export type InjectorOverride<T> = InjectorOverrideValue<T> | InjectorOverrideClass<T>;

export interface InjectorOverrideClass<T> {
  provide: T;
  useClass: T;
}

export interface InjectorOverrideValue<T> {
  provide: T;
  useValue: T;
}

export interface InjectorOptions {
  startups?: Constructable<OnStartup>[];
  overrides?: InjectorOverride<any>[];
}

export class Injector {
  private root = new InjectorRootContext();

  constructor(private options: InjectorOptions = {}) {}

  get<T extends object>(type: ServiceType<T>): T {
    const ctx = new InjectorContext(this.root);
    return ctx.get(type);
  }

  start() {
    for (const startup of this.options.startups || []) {
      const instance = this.get(startup);
      instance.onStartup();
    }
  }
}

class InjectorRootContext {
  private instances: { [key: string]: any } = {};

  get<T extends object>(type: ServiceType<T>): T {
    if (!isSingleInstance(type)) {
      throw new Error(`type ${type.name} is no single instance`);
    }

    if (!this.instances[type.name]) {
      const serviceInstance = new ServiceInstance(type, this);
      this.instances[type.name] = new Proxy(() => {}, serviceInstance);
      serviceInstance.initalize();
    }

    return this.instances[type.name];
  }
}

class ServiceInstance implements ProxyHandler<() => {}> {
  private instance: any | null = null;

  constructor(private type: ServiceType<any>, private ctx: InjectContext) {}

  initalize() {
    this.instance = new this.type(this.ctx);
  }

  get(target: any, p: PropertyKey, receiver: any): any {
    return this.instance[p];
  }
}

function isSingleInstance(type: ServiceType<any>): boolean {
  return (<any>type).singleInstance;
}

class InjectorContext implements InjectContext {
  private instances: { [key: string]: any } = {};

  constructor(private root: InjectorRootContext) {}

  get<T extends object>(type: ServiceType<T>): T {
    if (isSingleInstance(type)) {
      return this.root.get(type);
    }
    if (this.instances[type.name]) {
      return this.instances[type.name];
    }
    const serviceInstance = new ServiceInstance(type, this);
    this.instances[type.name] = new Proxy(() => {}, serviceInstance);
    serviceInstance.initalize();
    return this.instances[type.name];
  }
}

export interface InjectContext {
  get<T extends object>(type: ServiceType<T>): T;
}

export type ServiceType<T extends object> = (new (ctx: InjectContext) => T) | (new () => T);

class ConfigService {
  static singleInstance = true;

  private logging: LoggingService;

  constructor(ctx: InjectContext) {
    this.logging = ctx.get(LoggingService);
  }

  getString(key: string): string | null;
  getString(key: string, defaultValue: string): string;
  getString(key: string, defaultValue?: string): string | null {
    const value = process.env[key.toUpperCase()];
    if (value) {
      return value;
    }
    return defaultValue || null;
  }
  getBool(key: string): boolean | null;
  getBool(key: string, defaultValue: boolean): boolean;
  getBool(key: string, defaultValue?: boolean): boolean | null {
    const value = process.env[key.toUpperCase()];
    if (value) {
      if (value.toLowerCase() === 'true') {
        return true;
      } else if (value.toLowerCase() === 'false') {
        return false;
      } else {
        this.logging.warn(`config ${key} could not be parsed as boolean`);
      }
    }
    if (typeof defaultValue === 'boolean') {
      return defaultValue;
    }
    return null;
  }
  getNumber(key: string): number | null;
  getNumber(key: string, defaultValue: number): number;
  getNumber(key: string, defaultValue?: number): number | null {
    const value = process.env[key.toUpperCase()];
    if (value) {
      const numberValue = parseFloat(value);
      if (!isNaN(numberValue)) {
        return numberValue;
      } else {
        this.logging.warn(`config ${key} could not be parsed as number`);
      }
    }
    return defaultValue || null;
  }
}

class LoggingService {
  private config: ConfigService;
  constructor(ctx: InjectContext) {
    this.config = ctx.get(ConfigService);
  }

  warn(message: string) {}
}

class HealthService {
  static singleInstance = true;

  private healthy = true;
  private statuses: { [key: string]: boolean } = {};

  isHealthy(): boolean {
    return this.healthy;
  }

  updateStatus(key: string, value: boolean) {
    this.statuses[key] = value;
    this.healthy = Object.keys(this.statuses).every((key) => this.statuses[key]);
  }
}

class ProcessService implements OnStartup {
  static singleInstance = true;

  private config: ConfigService;
  private closeDefer = new Defer<void>();

  closePromise = this.closeDefer.promise;

  constructor(ctx: InjectContext) {
    this.config = ctx.get(ConfigService);
  }

  onStartup(): Promise<void> | void {
    process.on('SIGINT', () => {
      setTimeout(() => {
        this.exit();
      }, this.config.getNumber('PROCESS_EXIT_DELAY', 15000));
    });
  }

  exit() {
    this.closeDefer.resolve();
  }
}

abstract class ExpressService implements OnStartup {
  static singleInstance = true;

  private process: ProcessService;

  abstract port(): number;

  constructor(private ctx: InjectContext) {
    this.process = ctx.get(ProcessService);
  }

  onStartup(): Promise<void> | void {
    const server = createServer((req, res) => {});
    this.process.closePromise.then(() => {
      server.close();
    });
    server.listen(this.port(), () => {});
  }
}

class DbHealthService implements OnStartup {
  static singleInstance = true;

  private health: HealthService;

  constructor(ctx: InjectContext) {
    this.health = ctx.get(HealthService);
  }

  onDisconnect() {
    this.health.updateStatus('db', false);
  }

  onConnect() {
    this.health.updateStatus('db', true);
  }

  onStartup(): Promise<void> | void {
    this.health.updateStatus('db', false);
  }
}
