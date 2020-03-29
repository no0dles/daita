import {ContextUser} from '../auth';

export interface RelationalSchemaContextOptions {
  migrationId?: string;
  user?: ContextUser;
}