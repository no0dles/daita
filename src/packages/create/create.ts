import * as inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import { randomString } from '../common/utils/random-string';
import { getOwnPackageJson, PackageJson } from '../node/node';
import { readJsonFile, readYamlFile, writeFileIfNotExists, writePrettyJsonFile, writeYamlFile } from '../node/file';
import { DockerCompose } from '../node/docker';
import { ensurePathExists } from '../node/path';
import { failNever } from '../common/utils/fail-never';
import { shell } from '../node/command';

export interface CreateOptions {
  cwd?: string;
  npmClient?: string;
  skipInstall?: boolean;
  adapter?: string;
  projectName?: string;
}

export type SetupOptions = SetupPostgresOptions | SetupSqliteOptions;

export interface SetupPostgresOptions {
  projectDirectory: string;
  npmClient: 'npm' | 'yarn' | 'none';
  adapter: 'pg';
  password: string;
  projectName: string;
  daitaVersion: string;
}
export interface SetupSqliteOptions {
  projectDirectory: string;
  npmClient: 'npm' | 'yarn' | 'none';
  adapter: 'sqlite';
  projectName: string;
  daitaVersion: string;
}

export async function create(options: CreateOptions) {
  const prompts = inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: "What's your project name?",
      validate(input: any, answers?: any) {
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

  await setup({
    projectName: options.projectName || answers.projectName,
    password: randomString(20),
    adapter: options.adapter || answers.adapter,
    npmClient: options.npmClient || answers.npmClient,
    projectDirectory: path.join(options.cwd || process.cwd(), options.projectName || answers.projectName),
    daitaVersion: `^${getOwnPackageJson((pkg) => pkg.version)}`,
  });
}

export async function setup(options: SetupOptions) {
  ensurePathExists(options.projectDirectory);

  setupNpm(options);
  setupDaitaConfig(options);
  setupTsConfig(options);
  setupDockerCompose(options);
  setupSourceCode(options);

  if (options.npmClient === 'yarn') {
    await shell('yarn', ['install'], options.projectDirectory);
  } else if (options.npmClient === 'npm') {
    await shell('npm', ['install'], options.projectDirectory);
  }
}

export function setupReadme(options: SetupOptions) {
  fs.writeFileSync(path.join(options.projectDirectory, 'README.md'), '');
}

export function setupDaitaConfig(options: SetupOptions) {
  const configFile = path.join(options.projectDirectory, 'daita.json');
  const configContent = readJsonFile<any>(configFile, {});

  if (configContent.context) {
    configContent.context = {};
  }

  if (configContent.$schema) {
    configContent.$schema = './node_modules/@daita/cli/schema.json';
  }

  // TODO handle existing default
  configContent.context.default = {
    module: `@daita/${options.adapter}-adapter`,
    schemaLocation: 'src/schema.ts',
    migrationLocation: 'src/migrations',
    connectionString: getConnectionString(options),
  };

  writePrettyJsonFile(configFile, configContent);
}

function getConnectionString(options: SetupOptions): string {
  if (options.adapter === 'pg') {
    return `postgres://daita:${options.password}@localhost/${options.projectName}`;
  } else if (options.adapter === 'sqlite') {
    return `sqlite://./${options.projectName}.db`;
  } else {
    failNever(options, 'unknown database adapter');
  }
}

export function setupDockerCompose(options: SetupOptions) {
  if (options.adapter != 'pg') {
    return;
  }

  const dockerComposeFile = path.join(options.projectDirectory, 'docker-compose.yaml');
  const dockerComposeContent = readYamlFile<DockerCompose>(dockerComposeFile, {
    version: '3.5',
    services: {},
    volumes: {},
  });

  if (!dockerComposeContent.services) {
    dockerComposeContent.services = {};
  }
  if (!dockerComposeContent.volumes) {
    dockerComposeContent.volumes = {};
  }

  if (options.adapter === 'pg') {
    dockerComposeContent.services['postgres'] = {
      image: 'postgres',
      environment: [
        'POSTGRES_USER=daita',
        `POSTGRES_PASSWORD=${options.password}`,
        `POSTGRES_DB=${options.projectName}`,
      ],
      ports: ['5432:5432'],
      volumes: ['postgres-data:/var/lib/postgresql/data'],
    };
    dockerComposeContent.volumes['postgres-data'] = {};
  }

  writeYamlFile(dockerComposeFile, dockerComposeContent);
}

export function setupNpm(options: SetupOptions) {
  const packageFile = path.join(options.projectDirectory, 'package.json');
  const packageContent = readJsonFile<PackageJson>(packageFile, {
    name: options.projectName,
    version: '0.0.0',
    description: 'an awesome daita project',
    license: 'MIT',
  });

  if (!packageContent.dependencies) {
    packageContent.dependencies = {};
  }
  packageContent.dependencies[`@daita/${options.adapter}-adapter`] = options.daitaVersion;
  packageContent.dependencies[`@daita/relational`] = options.daitaVersion;
  packageContent.dependencies[`@daita/orm`] = options.daitaVersion;

  if (!packageContent.devDependencies) {
    packageContent.devDependencies = {};
  }
  packageContent.dependencies[`@daita/cli`] = options.daitaVersion;

  const typescriptVersion = getOwnPackageJson((pkg) => pkg.dependencies?.typescript || pkg.devDependencies?.typescript);
  if (typescriptVersion) {
    packageContent.dependencies['typescript'] = typescriptVersion;
  }

  if (!packageContent.scripts) {
    packageContent.scripts = {};
  }
  if (!packageContent.scripts['start']) {
    packageContent.scripts['start'] = 'node -r ts-node/register src/index.ts';
  }
  if (!packageContent.scripts['build']) {
    packageContent.scripts['build'] = 'tsc -b';
  }
  writePrettyJsonFile(packageFile, packageContent);
}

export function setupSourceCode(options: SetupOptions) {
  ensurePathExists(path.join(options.projectDirectory, 'src'));
  ensurePathExists(path.join(options.projectDirectory, 'src/models'));
  ensurePathExists(path.join(options.projectDirectory, 'src/migrations'));

  const schemaCreated = writeFileIfNotExists(
    path.join(options.projectDirectory, 'src/schema.ts'),
    getSchemaSourceCode(options),
  );

  if (schemaCreated) {
    writeFileIfNotExists(path.join(options.projectDirectory, 'src/models/todo.ts'), getTodoModelSourceCode(options));
    writeFileIfNotExists(path.join(options.projectDirectory, 'src/index.ts'), getIndexSourceCode(options));
  }
}

function getTodoModelSourceCode(options: SetupOptions) {
  return `
export class Todo {
  id!: string;
  title!: string;
  done = false;
}
`.trim();
}

function getIndexSourceCode(options: SetupOptions) {
  return `
import { getContext } from '@daita/orm';
import { table, field } from '@daita/relational';
import { adapter } from '@daita/${options.adapter}-adapter';
import { Todo } from './models/todo';
import { schema } from './schema';

const context = getContext(adapter, {
  schema,
  connectionString: process.env.DATABASE || '${getConnectionString(options)}'
});

context.select({
  select: {
    title: field(Todo, 'title')
  },
  from: table(Todo),
}).then(todos => {
  console.log(todos);
})
  `.trim();
}

function getSchemaSourceCode(options: SetupOptions) {
  return `
import { RelationalSchema } from '@daita/orm'
import { Todo } from './models/todo';

export const schema = new RelationalSchema('${options.projectName}');
schema.table(Todo);
  `.trim();
}

export function setupTsConfig(options: SetupOptions) {
  const tsConfigFile = path.join(options.projectDirectory, 'tsconfig.json');
  if (fs.existsSync(tsConfigFile)) {
    return;
  }

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

  writePrettyJsonFile(tsConfigFile, tsConfig);
}
