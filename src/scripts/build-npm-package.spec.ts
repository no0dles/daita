import * as path from 'path';
import { updatePath } from './npm';

describe('build-npm-package', () => {
  it('should', () => {
    const packages = new Set<string>();
    updatePath(
      packages,
      __dirname,
      path.join(__dirname, 'build-npm-package.test.js'),
    );
    expect(packages.has('foo'));
    expect(packages.has('foobar'));
  });
});
