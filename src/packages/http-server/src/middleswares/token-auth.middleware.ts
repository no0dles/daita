import { NextFunction, Request, Response } from 'express';
import { request as httpsRequest, RequestOptions } from 'https';
import { request as httpRequest } from 'http';
import { parse } from 'url';
import { HttpServerAuthorizationTokenEndpoint } from '../http-server-authorization';
import { hasRequestUser, setRequestUser } from '../get-request-user';

class TokenCache {
  private cache: { [key: string]: TokenUser } = {};
  private requestMethod = this.tokenEndpoint.uri.startsWith('https:') ? httpsRequest : httpRequest;
  constructor(private tokenEndpoint: HttpServerAuthorizationTokenEndpoint) {}

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

    const parsedUrl = parse(`${this.tokenEndpoint.uri}/${this.tokenEndpoint.issuer}/token/${token}`);
    const reqOptions: RequestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'POST',
    };

    return new Promise<TokenUser | null>((resolve, reject) => {
      const req = this.requestMethod(reqOptions, (res) => {
        if (res.statusCode === 401) {
          return resolve(null);
        } else if (res.statusCode === 404) {
          return reject(new Error('Token endpoint wrong configured'));
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

export function tokenAuth(tokenEndpoints: HttpServerAuthorizationTokenEndpoint[]) {
  const endpointCaches: { [key: string]: TokenCache } = {};
  for (const tokenEndpoint of tokenEndpoints) {
    endpointCaches[tokenEndpoint.issuer] = new TokenCache(tokenEndpoint);
  }
  return async (req: Request, res: Response, next: NextFunction) => {
    if (hasRequestUser(req)) {
      return next();
    }

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Token ')) {
      return next();
    }

    const token = req.headers.authorization.substr('Token '.length);
    const tokenParts = token.split(':');
    if (tokenParts.length !== 2) {
      return res.status(400).json({ message: 'invalid token format' });
    }
    const cache = endpointCaches[tokenParts[0]];
    if (!cache) {
      return res.status(400).json({ message: 'invalid issuer' });
    }

    const user = await cache.get(tokenParts[1]);
    if (!user) {
      return res.status(401).json({ message: 'invalid token' });
    }

    setRequestUser(req, user);
    next();
  };
}
