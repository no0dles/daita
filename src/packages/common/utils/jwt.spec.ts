import { parseJwtHeader, parseJwtPayload } from './jwt';

describe('utils/jwt', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  it('should parse header', () => {
    const header = parseJwtHeader(token);
    expect(header).toEqual({
      alg: 'HS256',
      typ: 'JWT',
    });
  });

  it('should parse payload', () => {
    const header = parseJwtPayload(token);
    expect(header).toEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    });
  });
});
