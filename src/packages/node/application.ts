import { createLogger } from '../common/utils/logger';

export interface Closable {
  close(callback?: (...args: any[]) => void): Promise<any> | any;
}
export class Application {
  private logger = createLogger({ package: 'node' });
  private closed = false;
  private shutdownTimeout: any | undefined;
  private instances: Closable[] = [];

  constructor() {
    process
      .on('unhandledRejection', (reason, p) => {
        this.logger.error('unhandled rejection', { reason });
      })
      .on('uncaughtException', (err) => {
        this.logger.error(err);
        process.exit(1);
      });

    const handleShutdown = () => {
      if (!this.shutdownTimeout) {
        this.logger.info('requested shutdown, schedule shutdown in 15 seconds, press Ctrl-C again to skip');
        this.shutdownTimeout = setTimeout(() => {
          this.close();
        }, 15000);
      } else {
        clearTimeout(this.shutdownTimeout);
        this.logger.info('force shutdown');
        this.close();
      }
    };

    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
  }

  attach(instance: Closable): void;
  attach(instance: Promise<Closable>): Promise<void>;
  attach(instance: Closable | Promise<Closable>): Promise<void> | void {
    if (this.closed) {
      if (instance instanceof Promise) {
        return instance
          .then((res) => {
            res.close();
          })
          .catch((err) => {
            this.logger.error(err);
          });
      } else {
        instance.close();
      }
    } else {
      if (instance instanceof Promise) {
        instance
          .then((res) => {
            if (this.closed) {
              res.close();
            } else {
              this.instances.push(res);
            }
          })
          .catch((err) => {
            if (!this.closed) {
              this.close(err);
            }
          });
      } else {
        this.instances.push(instance);
      }
    }
  }

  close(err?: Error) {
    if (err) {
      this.logger.error(err);
    }
    if (this.closed) {
      return;
    }
    this.closed = true;
    for (const closable of this.instances) {
      closable.close();
    }
  }
}
