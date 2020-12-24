import { AppAuthorizationProvider } from '../../http-server-common/app-authorization';
import { HttpError } from '../http-error';
import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../common/utils/logger';
import jose from 'jose';
import { default as jwtDecode } from 'jwt-decode';
import { Resolvable } from '../../common/utils/resolvable';
import { NodeHttp } from '../../http-client-common/node-http';

const logger = createLogger({ package: 'http-server', middleware: 'jwt-auth' });
export function jwtAuth(providers: AppAuthorizationProvider[]) {
  const clients: { [key: string]: Resolvable<jose.JWKS.KeyStore> } = {};
  for (const provider of providers) {
    const uri = provider.uri + '/' + provider.issuer + '/.well-known/jwks.json';
    logger.info(`register jwks client ${uri}`);
    clients[provider.issuer] = new Resolvable<jose.JWKS.KeyStore>(async () => {
      const http = new NodeHttp(provider.uri, null); // TODO refersh and retry
      const result = await http.json({ method: 'GET', path: provider.issuer + '/.well-known/jwks.json' });
      const keystore = new jose.JWKS.KeyStore((result.data.keys || []).map((key: any) => jose.JWK.asKey(key)));
      logger.debug(`loaded keys for ${provider.uri} with ${keystore.size} keys`);
      return keystore;
    });
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      return next();
    }

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return next();
    }

    const token = req.headers.authorization.substr('Bearer '.length);
    try {
      const decodedPayload = jwtDecode<{ iss: string }>(token);

      const client = clients[decodedPayload.iss];
      if (!client) {
        return next(new HttpError(400, `unknown token provider "${decodedPayload.iss}"`));
      }

      const keystore = await client.get();

      const verify = jose.JWT.verify(token, keystore) as any;
      logger.trace(`request logged in as ${verify.sub} on ${verify.iss}`);
      req.user = {
        exp: verify.exp,
        iat: verify.iat,
        iss: verify.iss!,
        sub: verify.sub!,
        roles: verify.roles,
      };
      next();
    } catch (e) {
      if (e.message.startsWith('Invalid token specified')) {
        return next(new HttpError(400, `invalid token format`));
      }
      next(e);
    }
  };
}
