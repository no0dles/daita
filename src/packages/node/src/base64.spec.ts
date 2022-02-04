import { decodeBase64, encodeBase64 } from './base64';

describe('common/utils/base64', () => {
  it('should decode ""', () => {
    expect(decodeBase64('')).toEqual('');
  });

  it('should decode "f"', () => {
    expect(encodeBase64('f')).toEqual('Zg==');
  });

  it('should decode "fo"', () => {
    expect(encodeBase64('fo')).toEqual('Zm8=');
  });

  it('should decode "foo"', () => {
    expect(encodeBase64('foo')).toEqual('Zm9v');
  });

  it('should encode "foo"', () => {
    expect(decodeBase64('Zm9v')).toEqual('foo');
  });

  it('should encode "fo"', () => {
    expect(decodeBase64('Zm8=')).toEqual('fo');
  });

  it('should encode "f"', () => {
    expect(decodeBase64('Zg==')).toEqual('f');
  });

  it('should encode ""', () => {
    expect(encodeBase64('')).toEqual('');
  });
});
