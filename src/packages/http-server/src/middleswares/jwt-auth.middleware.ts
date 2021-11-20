import { HttpServerAuthorizationProvider } from '@daita/http-server-common/http-server-authorization';
import { HttpError } from '../http-error';
import { NextFunction, Request, Response } from 'express';
import { createLogger } from '@daita/common/utils/logger';
import jose from 'jose';
import { Resolvable } from '@daita/common/utils/resolvable';
import { NodeHttp } from '@daita/http-client-common/node-http';
import { parseJwtPayload } from '@daita/common/utils/jwt';
import { hasRequestUser, setRequestUser } from '@daita/http-server-common/get-request-user';

const logger = createLogger({ package: 'http-server', middleware: 'jwt-auth' });
export function jwtAuth(providers: HttpServerAuthorizationProvider[]) {
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
    if (hasRequestUser(req)) {
      return next();
    }

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return next();
    }

    const token = req.headers.authorization.substr('Bearer '.length);
    try {
      const decodedPayload = parseJwtPayload(token);

      const client = clients[decodedPayload.iss];
      if (!client) {
        return next(new HttpError(400, `unknown token provider "${decodedPayload.iss}"`));
      }

      const keystore = await client.get();

      const verify = jose.JWT.verify(token, keystore) as any;
      logger.trace(`request logged in as ${verify.sub} on ${verify.iss}`);
      setRequestUser(req, {
        exp: verify.exp,
        iat: verify.iat,
        iss: verify.iss,
        sub: verify.sub,
        roles: verify.roles,
      });
      next();
    } catch (e) {
      if (e.message.startsWith('invalid format')) {
        return next(new HttpError(400, `invalid token format`));
      }
      next(e);
    }
  };
}
