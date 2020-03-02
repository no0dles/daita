import {Command} from '@oclif/command';
import {RelationalDataAdapter} from '@daita/core';
import {PostgresAdapter} from '@daita/pg';

export interface DaitaContextConfig {
  type: string;
  host?: string;
  user?: string;
  password?: string;
  uri?: string;
  port?: number;
  database?: string;
}

export function getRelationalDataAdapter(
  flags: { context: string | undefined, cwd: string | undefined },
  cmd: Command,
): RelationalDataAdapter | null {

  const config = require('config');
  const contextName = flags.context || 'default';
  if (!config.has(`daita.context.${contextName}`)) {
    cmd.error('Missing daita context configuration');
    return null;
  }

  const contextConfig = config.get(`daita.context.${contextName}`) as DaitaContextConfig;
  if (contextConfig.type === 'pg') {
    if (process.env.POSTGRES_URI) {
      return new PostgresAdapter(process.env.POSTGRES_URI);
    }

    if (contextConfig.uri) {
      return new PostgresAdapter(contextConfig.uri);
    } else {
      return new PostgresAdapter(
        `postgres://${contextConfig.user}:${contextConfig.password}@${
          contextConfig.host
        }:${contextConfig.port || 5432}/${contextConfig.database}`,
      );
    }
  }

  cmd.error(`Unknown daita context type "${contextConfig.type}"`);
  return null;
}
