import * as fs from 'fs';
import * as path from 'path';
import { DaitaContextConfig } from '../utils/data-adapter';
import * as yaml from 'yaml';
import { randomString } from '../../common/utils/random-string';

export function init(options: { cwd?: string }) {
  const cliFile = path.join(options.cwd || process.cwd(), 'daita.json');
  if (fs.existsSync(cliFile)) {
    console.log('daita.json already exists');
    return;
  }

  const password = randomString(20);
  const config: { context: { [key: string]: DaitaContextConfig } } = {
    context: {
      default: {
        connectionString: `postgres://daita:${password}@localhost/daita`, //TODO use package.json name?
        authorization: {
          providers: [
            {
              uri: 'http://localhost:8766',
              issuer: 'default',
            },
          ],
        },
        schemaLocation: 'src/schema.ts',
        options: {
          createIfNotExists: true,
        },
      },
    },
  };
  fs.writeFileSync(cliFile, JSON.stringify(config, null, 2));

  const dockerComposeFile = path.join(options.cwd || process.cwd(), 'docker-compose.yaml');
  if (!fs.existsSync(dockerComposeFile)) {
    const dockerCompose: any = {
      version: '3.5',
      services: {},
      volumes: {},
    };
    dockerCompose.services['postgres'] = {
      image: 'postgres',
      environment: ['POSTGRES_USER=daita', `POSTGRES_PASSWORD=${password}`, `POSTGRES_DB=daita`],
      ports: ['5432:5432'],
      volumes: ['postgres-data:/var/lib/postgresql/data'],
    };
    dockerCompose.volumes['postgres-data'] = {};
    fs.writeFileSync(dockerComposeFile, yaml.stringify(dockerCompose, { indent: 2 }));
  }
}
