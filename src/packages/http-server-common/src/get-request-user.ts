export function getRequestUser(req: any): RequestUser | null {
  if (req.user) {
    return req.user;
  } else {
    return null;
  }
}

export function hasRequestUser(req: any): boolean {
  return !!req.user;
}

export function getRequiredRequestUserProp<K extends keyof RequestUser>(req: any, field: K): RequestUser[K] {
  const user = getRequestUser(req);
  if (!user || user[field] === null || user[field] === undefined) {
    throw new Error(`missing ${field} on request user`);
  }
  return user[field];
}
export function getOptionalRequestUserProp<K extends keyof RequestUser>(req: any, field: K): RequestUser[K] | null {
  const user = getRequestUser(req);
  if (!user || user[field] === null || user[field] === undefined) {
    return null;
  }
  return user[field];
}

export function setRequestUser(req: any, user: RequestUser) {
  req.user = user;
}

export interface RequestUser {
  sub: string;
  iss: string;
  iat?: number;
  exp?: number;
  roles?: string[];
}
