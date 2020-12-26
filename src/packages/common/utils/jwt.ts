export function parseJwtHeader(token: string): JwtHeader {
  const tokenPart = token.split('.')[0];
  const content = Buffer.from(tokenPart, 'base64').toString();
  return JSON.parse(content);
}

export interface JwtHeader {
  alg: string;
  typ: 'JWT';
  kid?: string;
}

export interface JwtPayload {
  iat: number;
  exp: number;
  iss: string;
  sub: string;
}

export function parseJwtPayload<T>(token: string): T & JwtPayload {
  const tokenPart = token.split('.')[1];
  const content = Buffer.from(tokenPart, 'base64').toString();
  return JSON.parse(content);
}
