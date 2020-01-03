import * as config from 'config';
import { PostgresDataAdapter } from '@daita/core/dist/postgres';
import { Command } from '@oclif/command';
import { RelationalDataAdapter } from '@daita/core';

export function getRelationalDataAdapter(
  flags: { context: string | undefined },
  cmd: Command,
): RelationalDataAdapter | null {
  const contextName = flags.context || 'default';
  if (!config.has(`daita.context.${contextName}`)) {
    cmd.error('Missing daita context configuration');
    return null;
  }

  const contextConfig = config.get<{
    type: string;
    host?: string;
    user?: string;
    password?: string;
    uri?: string;
    port?: number;
    database?: string;
  }>(`daita.context.${contextName}`);
  if (contextConfig.type === 'pg') {
    if (contextConfig.uri) {
      return new PostgresDataAdapter(contextConfig.uri);
    } else {
      return new PostgresDataAdapter(
        `postgres://${contextConfig.user}:${contextConfig.password}@${
          contextConfig.host
        }:${contextConfig.port ?? 5432}/${contextConfig.database}`,
      );
    }
  }

  cmd.error(`Unknown daita context type "${contextConfig.type}"`);
  return null;
}
