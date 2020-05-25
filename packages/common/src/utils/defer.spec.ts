import { Defer } from './defer';

describe('utils/defer', () => {
  it('should resolve', async () => {
    const defer = new Defer<string>();
    expect(defer.isResolved).toBeFalsy();
    expect(defer.isRejected).toBeFalsy();
    defer.resolve('foo');
    const result = await defer.promise;
    expect(result).toEqual('foo');
    expect(defer.resolvedResult).toEqual('foo');
    expect(defer.isResolved).toBeTruthy();
    expect(defer.isRejected).toBeFalsy();
  });
  it('should reject', async () => {
    const defer = new Defer<string>();
    expect(defer.isResolved).toBeFalsy();
    expect(defer.isRejected).toBeFalsy();
    defer.reject(new Error('err'));
    expect(defer.isResolved).toBeFalsy();
    expect(defer.isRejected).toBeTruthy();
    try {
      await defer.promise;
      expect(true).toEqual(false);
    } catch (e) {
      expect(e.message).toEqual('err');
    }
    expect(defer.rejectedError).toEqual(new Error('err'));
  });
});
