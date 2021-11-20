import { getKeyForId } from './key';
import { parseJwtHeader, parseJwtPayload } from '@daita/common/utils/jwt';
import { JWT } from 'jose';

export async function verifyToken(token: string): Promise<any> {
  const header = parseJwtHeader(token);
  const payload = parseJwtPayload(token);
  if (!payload || !header) {
    return null;
  }

  if (!header.kid) {
    // TODO log
    return null;
  }

  const key = await getKeyForId(payload.iss, header.kid);

  JWT.verify(token, key, {});
  return payload;
}
