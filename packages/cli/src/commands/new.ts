import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import * as Listr from 'listr';
import {exec} from 'child_process';


export default class New extends Command {
  static description = 'creates a new project';

  static flags = {
    database: flags.string({
      char: 'd',
      description: 'database',
      options: ['postgres', 'mysql', 'mongodb'],
    }),
    license: flags.string({
      char: 'l',
      description: 'license of project',
    }),
    path: flags.string({
      char: 'p',
      description: 'path of project',
    }),
    'npm-client': flags.string({
      description: 'npm client to install dependencies',
      options: ['yarn', 'npm'],
      default: 'npm',
    }),
    'skip-install': flags.boolean({
      description: 'skip install of dependencies',
      default: false,
    }),
  };

  static args = [
    {name: 'name'},
  ];

  async run() {
    const {flags, args} = this.parse(New);

    let name = args.name;
    let license = flags.license;
    let database = flags.database;

    if (!name) {
      name = await cli.prompt('Whats your project name?', {default: ''});
    }

    const projectPath = flags.path || path.join(process.cwd(), name);
    if (fs.existsSync(projectPath)) {
      this.error(`Directory "${projectPath}" already exists, needs to be empty`);
      this.exit(1);
      return;
    }

    if (!database) {
      let responses: any = await inquirer.prompt([{
        name: 'database',
        message: 'select a database',
        type: 'list',
        choices: [
          {name: 'postgres'},
          {name: 'mysql'},
          {name: 'mongodb'},
        ],
      }]);
      database = responses.database
    }

    if (!license) {
      license = await cli.prompt('License:', {default: 'MIT'});
    }

    const variables = {
      NAME: name,
      LICENSE: license,
      DAITA_VERSION: `^${this.config.version}`,
      DATA_ADAPTER_IMPORT: '',
      DATA_ADAPTER_TYPE: '',
      DATA_ADAPTER: '',
      DATA_ADAPTER_URI: '',
      DATA_ADAPTER_NPM: '"pg": "^7.15.1"',
    };

    if (database === 'postgres') {
      variables.DATA_ADAPTER_URI = 'postgres://daita:daita@localhost/daita';
      variables.DATA_ADAPTER_IMPORT = 'import {PostgresDataAdapter} from \'@daita/core/dist/postgres\'';
      variables.DATA_ADAPTER_TYPE = 'pg';
      variables.DATA_ADAPTER = 'new PostgresDataAdapter(connectionString)';
      variables.DATA_ADAPTER_NPM = '"pg": "^7.15.1"';
    }

    if (!variables.DATA_ADAPTER) {
      this.error('Database not supported yet');
      this.exit(1);
      return;
    }


    const tasks = new Listr([
      {
        title: 'Scaffold project',
        task: ctx => {
          renderTemplate('node', projectPath, variables);
        },
      },
      {
        title: 'Install dependencies',
        task: async (ctx) => {
          await installDependencies(flags['npm-client'], projectPath);
        },
      },
    ]);
    await tasks.run();

    this.log('cd foo');
    this.log('docker-compose up -d');
    this.log('npx dc migration:add init');
    this.log('npx dc migration:apply');
    this.log('npm start');
  }
}

function installDependencies(npmClient: string, projectPath: string) {
  switch (npmClient) {
    case 'npm':
      return runCommand('npm install', projectPath);
    case 'yarn':
      return runCommand('yarn install', projectPath);
  }
}

function runCommand(cmd: string, cwd: string) {
  return new Promise(((resolve, reject) => {
    exec(cmd, {cwd}, (err) => {
      if (err) {
        reject(err.message);
      } else {
        resolve();
      }
    });
  }));
}

function renderTemplate(name: string, projectPath: string, variables: any) {
  const templatePath = path.join(__dirname, '../../templates', name);

  renderTemplateFiles(templatePath, projectPath, variables);
}

function renderTemplateFiles(templatePath: string, projectPath: string, variables: any) {
  fs.mkdirSync(projectPath);

  const files = fs.readdirSync(templatePath, {withFileTypes: true});
  for (const file of files) {
    if (file.isDirectory()) {
      renderTemplateFiles(path.join(templatePath, file.name), path.join(projectPath, file.name), variables);
    } else {
      renderTemplateFile(path.join(templatePath, file.name), path.join(projectPath, file.name), variables);
    }
  }
}

function renderTemplateFile(templateFileName: string, projectFileName: string, variables: any) {
  let content = fs.readFileSync(templateFileName).toString();
  for (const variableName of Object.keys(variables)) {
    content = content.replace(new RegExp(`\{\{${variableName}\}\}`, 'g'), variables[variableName]);
  }

  fs.writeFileSync(projectFileName, content);
}