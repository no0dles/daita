export interface Closable {
  close(callback?: (...args: any[]) => void): Promise<any> | any;
}
export class Application {
  private closed = false;
  private instances: Closable[] = [];

  constructor() {
    process
      .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
      })
      .on('uncaughtException', (err) => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
      });

    process.on('SIGTERM', () => {
      setTimeout(() => {
        this.close();
      }, 15000);
    });
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
            console.error(err);
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
    console.error(err);
    if (this.closed) {
      return;
    }
    this.closed = true;
    for (const closable of this.instances) {
      closable.close();
    }
  }
}
