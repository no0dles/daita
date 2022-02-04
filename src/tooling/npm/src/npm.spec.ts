import { buildNpmPackage, buildNpmPackages } from './npm';

describe('npm', () => {
  it('should build npm package common', async () => {
    await buildNpmPackage('common');
  });
  it('should build npm packages', async () => {
    await buildNpmPackages();
  }, 300000);
});
