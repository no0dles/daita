const fs = require('fs');
const path = require('path');

const pkgDir = process.cwd();
const pkgFile = path.join(pkgDir, 'package.json');
const publishDir = path.join(pkgDir, 'dist');
const publishFile = path.join(publishDir, 'package.json');

const pkg = require(pkgFile);
delete pkg.scripts;
delete pkg.devDependencies;

pkg.repository = {
  'type': 'git',
  'url': 'https://github.com/no0dles/daita'
};
pkg.bugs = {
  'url': 'https://github.com/no0dles/daita/issues'
};
pkg.homepage = 'https://daita.ch';

fs.writeFileSync(publishFile, JSON.stringify(pkg, null, 2), { encoding: 'utf8', flag: 'w' });
