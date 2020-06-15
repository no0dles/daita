import * as inquirer from 'inquirer';
import * as fs from "fs";
import * as path from "path";
import * as yaml from 'yaml';
import { spawn } from "child_process";

export async function create() {
  const dir = process.cwd();
  const prompts = inquirer.prompt([{
    type: 'input',
    name: 'projectName',
    message: 'What\'s your project name?',
    validate(input: any, answers?: any) {
      if (fs.existsSync(path.join(dir, input))) {
        return `directory ${input} already exists`;
      }
      if(!/^[a-zA-Z0-9_\-]+$/.test(input)) {
        return 'project name only supports alphanumeric characters including dash und underscore'
      }
      return true;
    },
  }, {
    type: 'list',
    default: 'npm',
    name: 'npmClient',
    message: 'What\'s your npm client?',
    choices: ['npm', 'yarn', 'none'],
  }, {
    type: 'list',
    message: 'Which adapters do you need?',
    name: 'adapter',
    choices: ['pg', 'sqlite'],
  }]);


  const answers = await prompts;
  const createPackageJson = getOwnPackageJson();
  const projectDir = path.join(dir, answers.projectName);
  const password = generateRandomPassword();
  const daitaVersion = `^${createPackageJson.version}`;

  const packageJson: any = {
    'name': answers.projectName,
    'version': '0.0.0',
    'description': 'an awesome daita project',
    'license': 'MIT',
    'dependencies': {
      'typescript': '^3.9.3',
      '@daita/relational': daitaVersion,
      '@daita/orm': daitaVersion,
    },
    'devDependencies': {
      '@daita/cli': daitaVersion,
    },
    'scripts': {
      'start': 'node -r ts-node/register src/index.ts',
      'build': 'tsc -b',
    },
  };

  const dockerCompose: any = {
    version: '3.5',
    services: {},
    volumes: {},
  };

  const tsConfig: any = {
    'compilerOptions': {
      'module': 'commonjs',
      'rootDir': 'src',
      'outDir': 'dist',
      'target': 'es6',
      'lib': ['es2019'],
      'moduleResolution': 'node',
      'declaration': true,
      'declarationMap': true,
      'sourceMap': true,
      'strict': true,
      'noImplicitAny': true,
      'noImplicitThis': true,
      'removeComments': true,
    },
    'exclude': [
      'node_modules',
      'dist',
    ],
  };

  const defaultConfig: any = {
    'daita': {
      'context': {
        'default': {},
      },
    },
  };

  packageJson.dependencies[`@daita/${answers.adapter}-adapter`] = daitaVersion;

  if (answers.adapter === 'pg') {
    dockerCompose.services['postgres'] = {
      image: 'postgres',
      environment: [
        'POSTGRES_USER=daita',
        `POSTGRES_PASSWORD=${password}`,
        `POSTGRES_DB=${answers.projectName}`,
      ],
      ports: ['5432:5432'],
      volumes: ['postgres-data:/var/lib/postgresql/data'],
    };
    dockerCompose.volumes['postgres-data'] = {};
    defaultConfig.daita.context.default.module = '@daita/pg-adapter';
    defaultConfig.daita.context.default.connectionString = `postgres://daita:${password}@localhost/${answers.projectName}`;
  } else if (answers.adapter === 'sqlite') {
    defaultConfig.daita.context.default.module = '@daita/sqlite-adapter';
    defaultConfig.daita.context.default.connectionString = `sqlite://./${answers.projectName}.db`;
  }

  fs.mkdirSync(projectDir);
  fs.mkdirSync(path.join(projectDir, 'src'));
  fs.mkdirSync(path.join(projectDir, 'src/models'));
  fs.mkdirSync(path.join(projectDir, 'src/migrations'));
  fs.mkdirSync(path.join(projectDir, 'config'));

  fs.writeFileSync(path.join(projectDir, 'src/index.ts'), '');
  fs.writeFileSync(path.join(projectDir, 'config/default.json'), JSON.stringify(defaultConfig, null, 2));
  fs.writeFileSync(path.join(projectDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
  fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(path.join(projectDir, 'README.md'), '');
  if (Object.keys(dockerCompose.services).length > 0) {
    fs.writeFileSync(path.join(projectDir, 'docker-compose.yaml'), yaml.stringify(dockerCompose, { indent: 2 }));
  }
  if (answers.npmClient === 'yarn') {
    await runCommand('yarn', ['install'], projectDir);
  } else if (answers.npmClient === 'npm') {
    await runCommand('npm', ['install'], projectDir);
  }
}


function getOwnPackageJson() {
  if (fs.existsSync(path.join(__dirname, 'package.json'))) {
    return require(path.join(__dirname, 'package.json'));
  } else if (fs.existsSync(path.join(__dirname, '../package.json'))) {
    return require(path.join(__dirname, '../package.json'));
  } else {
    throw new Error('unable to get package version');
  }
}


const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
const eventIdLength = 22;

export function generateRandomPassword() {
  let id = '';
  for (let i = 0; i < eventIdLength; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}


function runCommand(cmd: string, args: string[], cwd: string) {
  return new Promise(((resolve, reject) => {
    const ps = spawn(cmd, args, { cwd, stdio: [process.stdin, process.stdout, process.stderr] });
    ps.once('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  }));
}
