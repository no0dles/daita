export function parseJwtHeader(token: string): JwtHeader {
  return parse(token, 0);
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

function parse(token: string, partIndex: number) {
  const tokenPart = token.split('.')[partIndex];
  let content = '';
  try {
    if (typeof window !== 'undefined') {
      content = atob(tokenPart);
    } else {
      content = Buffer.from(tokenPart, 'base64').toString();
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('invalid format: ' + e.message);
    } else {
      throw new Error(`invalid format: ${e}`);
    }
  }
  return JSON.parse(content);
}

export function parseJwtPayload<T>(token: string): T & JwtPayload {
  return parse(token, 1);
}
