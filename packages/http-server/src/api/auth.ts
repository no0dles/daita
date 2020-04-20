import * as express from "express";
import { TokenProvider } from "../auth/token-provider";
import { SqlPermissions } from "@daita/core";

declare global {
  namespace Express {
    export interface Request {
      permissions?: SqlPermissions | null;
    }
  }
}

export function authMiddleware(options: { tokenProvider: TokenProvider }): express.RequestHandler {
  return async (req, res, next) => {
    const authorization = req.header("authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next();
    }

    try {
      const token = authorization.substr("Bearer ".length);
      const result = await options.tokenProvider.verify(token);
      req.permissions = result.permissions;
      next();
    } catch (e) {
      next(e);
    }
  };
}
