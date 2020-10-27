import { NextFunction, Request, Response } from 'express';
import { AppAuthorizationTokenEndpoint } from '../../http-server-common/app-authorization';
import { request as httpsRequest, RequestOptions } from 'https';
import { request as httpRequest } from 'http';
import { parse } from 'url';

class TokenCache {
  private cache: { [key: string]: TokenUser } = {};
  private requestMethod = this.tokenEndpoint.url.startsWith('https:') ? httpsRequest : httpRequest;
  constructor(private tokenEndpoint: AppAuthorizationTokenEndpoint) {}

  async get(token: string): Promise<TokenUser | null> {
    if (this.cache[token]) {
      const user = this.cache[token];
      const now = new Date().getTime() / 1000;
      if (!user.exp || user.exp < now) {
        return user;
      } else {
        delete this.cache[token];
      }
    }

    const parsedUrl = parse(this.tokenEndpoint.url + token);
    const reqOptions: RequestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'POST',
    };

    return new Promise<TokenUser | null>((resolve, reject) => {
      const req = this.requestMethod(reqOptions, (res) => {
        if (res.statusCode === 404) {
          return resolve(null);
        }

        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const responseData = JSON.parse(data);
          this.cache[token] = responseData;
          resolve(responseData);
        });
      }).on('error', (err) => {
        reject(err);
      });
      req.end();
    });
  }
}

export interface TokenUser {
  roles: string[];
  sub: string;
  iss: string;
  exp?: number;
  iat: number;
}

export function tokenAuth(tokenEndpoint: AppAuthorizationTokenEndpoint) {
  const cache = new TokenCache(tokenEndpoint);
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      return next();
    }

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Token ')) {
      return next();
    }

    const token = req.headers.authorization.substr('Token '.length);
    const user = await cache.get(token);
    if (!user) {
      return res.status(401).json({ message: '' });
    }

    req.user = user;
    next();
  };
}
