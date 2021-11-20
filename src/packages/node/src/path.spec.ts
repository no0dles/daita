import { popPath } from './path';

describe('packages/node/path', () => {
  it('should popPath /home/example/repos/foo', () => {
    const result = popPath('/home/example/repos/foo');
    expect(result.start).toEqual('/home/example/repos');
    expect(result.end).toEqual('foo');
  });
});
