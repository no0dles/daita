import * as inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { spawn } from 'child_process';
import { randomString } from '../common/utils/random-string';

export async function create(options: {
  npmClient?: string;
  skipInstall?: boolean;
  adapter?: string;
  projectName?: string;
}) {
  const dir = process.cwd();
  const prompts = inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: "What's your project name?",
      validate(input: any, answers?: any) {
        if (fs.existsSync(path.join(dir, input))) {
          return `directory ${input} already exists`;
        }
        if (!/^[a-zA-Z0-9_\-]+$/.test(input)) {
          return 'project name only supports alphanumeric characters including dash und underscore';
        }
        return true;
      },
      when: !options.projectName,
    },
    {
      type: 'list',
      message: 'Which adapters do you need?',
      name: 'adapter',
      choices: ['pg', 'sqlite'],
      when: !options.adapter,
    },
  ]);

  const answers = await prompts;
  const npmClient = options.npmClient || answers.npmClient;
  const skipInstall = options.skipInstall || answers.npmClient === 'none';
  const adapter = options.adapter || answers.adapter;
  const projectName = options.projectName || answers.projectName;

  if (fs.existsSync(path.join(dir, projectName))) {
    console.log(`directory ${projectName} already exists`);
    process.exit(1);
    return;
  }

  const daitaVersion = `^${getOwnPackageJson((pkg) => pkg.version)}`;
  const projectDir = path.join(dir, projectName);
  const password = randomString(20);

  const packageJson: any = {
    name: projectName,
    version: '0.0.0',
    description: 'an awesome daita project',
    license: 'MIT',
    dependencies: {
      typescript: getOwnPackageJson((pkg) => pkg.dependencies.typescript),
      '@daita/relational': daitaVersion,
      '@daita/orm': daitaVersion,
    },
    devDependencies: {
      '@daita/cli': daitaVersion,
    },
    scripts: {
      start: 'node -r ts-node/register src/index.ts',
      build: 'tsc -b',
    },
  };

  const dockerCompose: any = {
    version: '3.5',
    services: {},
    volumes: {},
  };

  const tsConfig: any = {
    compilerOptions: {
      module: 'commonjs',
      rootDir: 'src',
      outDir: 'dist',
      target: 'es6',
      lib: ['es2020'],
      moduleResolution: 'node',
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      strict: true,
      noImplicitAny: true,
      noImplicitThis: true,
      removeComments: true,
    },
    exclude: ['node_modules', 'dist'],
  };

  const defaultConfig: any = {
    context: {
      default: {
        module: `@daita/${adapter}-adapter`,
        schemaLocation: 'src/schema.ts',
        migrationLocation: 'src/migrations',
      },
    },
  };

  packageJson.dependencies[`@daita/${adapter}-adapter`] = daitaVersion;

  if (adapter === 'pg') {
    dockerCompose.services['postgres'] = {
      image: 'postgres',
      environment: ['POSTGRES_USER=daita', `POSTGRES_PASSWORD=${password}`, `POSTGRES_DB=${projectName}`],
      ports: ['5432:5432'],
      volumes: ['postgres-data:/var/lib/postgresql/data'],
    };
    dockerCompose.volumes['postgres-data'] = {};
    defaultConfig.context.default.connectionString = `postgres://daita:${password}@localhost/${projectName}`;
  } else if (adapter === 'sqlite') {
    defaultConfig.context.default.connectionString = `sqlite://./${projectName}.db`;
  }

  fs.mkdirSync(projectDir);
  fs.mkdirSync(path.join(projectDir, 'src'));
  fs.mkdirSync(path.join(projectDir, 'src/models'));
  fs.mkdirSync(path.join(projectDir, 'src/migrations'));

  fs.writeFileSync(path.join(projectDir, 'src/index.ts'), '');
  fs.writeFileSync(path.join(projectDir, 'daita.json'), JSON.stringify(defaultConfig, null, 2));
  fs.writeFileSync(path.join(projectDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
  fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(path.join(projectDir, 'README.md'), '');
  if (Object.keys(dockerCompose.services).length > 0) {
    fs.writeFileSync(path.join(projectDir, 'docker-compose.yaml'), yaml.stringify(dockerCompose, { indent: 2 }));
  }

  if (!skipInstall) {
    if (npmClient === 'yarn') {
      await runCommand('yarn', ['install'], projectDir);
    } else if (npmClient === 'npm') {
      await runCommand('npm', ['install'], projectDir);
    }
  }
}

export function getOwnPackageJson<T>(selector: (pkg: any) => T, dir?: string): T | null {
  const currentDir = path.join(dir || __dirname);
  const packagePath = path.join(currentDir, 'package.json');

  if (fs.existsSync(packagePath)) {
    const packageContent = require(packagePath);
    const value = selector(packageContent);
    if (value !== null && value !== undefined) {
      return value;
    }
  }
  const parentDir = path.resolve(currentDir, '..');
  if (parentDir === currentDir) {
    return null;
  }
  return getOwnPackageJson(selector, parentDir);
}

function runCommand(cmd: string, args: string[], cwd: string) {
  return new Promise((resolve, reject) => {
    const ps = spawn(cmd, args, {
      cwd,
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    ps.once('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  });
}
