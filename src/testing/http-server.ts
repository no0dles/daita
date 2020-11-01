import { Express } from 'express';
import { Server } from 'http';
import axios from 'axios';
import { Defer } from '../packages/common/utils/defer';

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

  constructor(private app: Express, port?: number) {
    this.port = port ?? 9000 + Math.floor(Math.random() * 1000);
    this.uri = `http://localhost:${this.port}`;
  }

  async close(): Promise<void> {
    if (!this.server) {
      return;
    }
    const defer = new Defer<void>();
    this.server.close((err) => {
      this.server = null;
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve();
      }
    });
    await defer.promise;
  }

  async start(): Promise<void> {
    if (this.server) {
      return;
    }
    const defer = new Defer<void>();
    this.server = this.app.listen(this.port, () => {
      defer.resolve();
    });
    await defer.promise;
  }
}

export function getServer(app: Express, port?: number): HttpServerApp {
  return new HttpExpressServerApp(app, port);
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
  try {
    const res = await axios.post(app.uri + (path.startsWith('/') ? path : `/${path}`), json, {
      headers: options?.headers,
    });
    return {
      statusCode: res.status,
      body: res.data,
    };
  } catch (e) {
    return {
      statusCode: e.response.status,
      body: e.response.data,
    };
  }
}

export async function httpGet<T = any>(
  app: HttpServerApp,
  path: string,
  options?: { headers: any },
): Promise<GetResult<T>> {
  try {
    const res = await axios.get(app.uri + (path.startsWith('/') ? path : `/${path}`), { headers: options?.headers });
    return {
      statusCode: res.status,
      body: res.data,
    };
  } catch (e) {
    return {
      statusCode: e.response.status,
      body: e.response.data,
    };
  }
}
