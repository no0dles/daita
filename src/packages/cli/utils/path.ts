import * as path from 'path';
import { AstContext } from '../ast/ast-context';
import { parseSchemas } from '../migration/parsing/parse-schemas';
import { SchemaDeclaration } from '../migration/parsing/schema-declaration';
import { parseSchemaMigrations, parseSchemaMigrationVariables } from '../migration/parsing/parse-schema-migrations';
import { parseRelationalSchema } from '../migration/parsing/parse-relational-schema';
import { getProjectConfig } from './config';
import { createLogger } from '../../common/utils/logger';
import { SchemaDescription } from '../../orm/schema/description/relational-schema-description';

export function getMigrationRelativePath(schemaFilePath: string, migrationFilePath: string) {
  const relativePath = path.relative(schemaFilePath, migrationFilePath);
  return './' + relativePath.substr(0, relativePath.length - 3);
}

export interface SchemaLocation {
  fileName: string;
  directory: string;
  migrationDirectory: string;
  schemaName?: string;
}

export async function getSchemaLocation(opts: { schema?: string; cwd?: string }): Promise<SchemaLocation> {
  const config = getProjectConfig(opts);

  const migrationDirectory = path.join(opts.cwd || process.cwd(), config.migrationLocation || 'src/migrations');
  const schemaPath = path.join(opts.cwd || process.cwd(), opts.schema || config.schemaLocation || 'src/schema.ts');
  return resolveSchemaLocation(schemaPath, migrationDirectory, config.schemaName);
}

function resolveSchemaLocation(
  fileName: string,
  migrationDirectory: string,
  schemaName: string | undefined,
): SchemaLocation {
  return {
    fileName,
    directory: path.dirname(fileName),
    migrationDirectory,
    schemaName,
  };
}

export async function getSchemaInformation(
  astContext: AstContext,
  location: SchemaLocation,
): Promise<SchemaInformation | null> {
  const sourceFile = astContext.get(location.fileName);
  if (!sourceFile) {
    throw new Error(`source file ${location.fileName} not found`);
  }

  const schemas = parseSchemas(sourceFile);

  if (schemas.length === 0) {
    logger.warn(`No schema found in ${location.fileName}`);
    return null;
  }

  if (schemas.length > 1) {
    const schema = schemas.filter((s) => s.variable.name === location.schemaName)[0];
    if (!schema) {
      if (location.schemaName) {
        throw new Error(`unable to find schema ${location.schemaName} in ${location.fileName}`);
      } else {
        throw new Error(`multiple schemas in ${location.fileName}, please set schemaName in daita.json`);
      }
    }
    return new SchemaInformation(schema);
  } else {
    return new SchemaInformation(schemas[0]);
  }
}

const logger = createLogger({ package: 'cli' });

export class SchemaInformation {
  constructor(private schemaDeclaration: SchemaDeclaration) {}

  get variableName() {
    return this.schemaDeclaration.variable.name;
  }

  getMigrationTree() {
    return parseSchemaMigrations(this.schemaDeclaration.variable);
  }

  getRelationalSchema(): SchemaDescription {
    return parseRelationalSchema(this.schemaDeclaration.variable);
  }

  getMigrationVariables() {
    return parseSchemaMigrationVariables(this.schemaDeclaration.variable);
  }
}
