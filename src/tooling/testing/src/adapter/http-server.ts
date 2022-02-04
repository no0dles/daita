import { Server } from 'http';
import { NodeHttp } from '@daita/node';

export interface HttpServerApp {
  start(): Promise<void>;

  close(): Promise<void>;
  uri: string;
  port: number;
}

export class HttpExpressServerApp implements HttpServerApp {
  private server: Server | null = null;
  public readonly port: number;
  public readonly uri: string;

  constructor(private fn: (port: number) => Promise<Server>) {
    this.port = 9000 + Math.floor(Math.random() * 1000);
    this.uri = `http://localhost:${this.port}`;
  }

  async close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((err) => {
        this.server = null;
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async start(): Promise<void> {
    if (this.server) {
      return;
    }
    this.server = await this.fn(this.port);
  }
}

export function getServer(fn: (port: number) => Promise<Server>): HttpServerApp {
  return new HttpExpressServerApp(fn);
}

export interface GetResult<T> {
  statusCode: number;
  body: T;
}

export async function httpPost<T = any>(
  app: HttpServerApp,
  path: string,
  json: any,
  options?: { headers: any },
): Promise<GetResult<T>> {
  const http = new NodeHttp(app.uri, null);
  const res = await http.json({
    path,
    data: json,
    headers: options?.headers,
  });
  return {
    statusCode: res.statusCode,
    body: res.data,
  };
}

export async function httpGet<T = any>(
  app: HttpServerApp,
  path: string,
  options?: { headers: any },
): Promise<GetResult<T>> {
  const http = new NodeHttp(app.uri, null);
  const res = await http.get<T>({
    path,
    headers: options?.headers,
  });
  return {
    statusCode: res.statusCode,
    body: res.data,
  };
}
