import * as path from 'path';
import * as fs from 'fs';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';
import { AstContext } from '../ast/ast-context';
import { parseSchemas } from '../migration/parsing/parse-schemas';
import { SchemaDeclaration } from '../migration/parsing/schema-declaration';
import { parseSchemaMigrationCalls, parseSchemaMigrations } from '../migration/parsing/parse-schema-migrations';
import { parseRelationalSchema } from '../migration/parsing/parse-relational-schema';
import { RelationalSchemaDescription } from '@daita/orm';

export function getMigrationRelativePath(
  schemaFilePath: string,
  migrationFilePath: string,
) {
  const relativePath = path.relative(schemaFilePath, migrationFilePath);
  return './' + relativePath.substr(0, relativePath.length - 3);
}

export interface SchemaLocation {
  fileName: string;
  directory: string;
  migrationDirectory: string;
  sourceDirectory: string;
}

export async function getSchemaLocation(
  opts: { schema: string | undefined, cwd: string | undefined }
): Promise<SchemaLocation> {
  const cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd();
  let sourceDirectory = path.join(cwd, 'src');
  const tsconfigFileName = path.join(cwd, 'tsconfig.json');
  if (fs.existsSync(tsconfigFileName)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigFileName).toString());
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.rootDir) {
      sourceDirectory = path.join(
        cwd,
        tsconfig.compilerOptions.rootDir,
      );
    }
  }

  const migrationDirectory = path.join(sourceDirectory, 'migrations');

  let fileName = '';
  if (opts.schema) {
    fileName = path.join(cwd, opts.schema);

    if (fs.existsSync(fileName)) {
      return resolveSchemaLocation(
        fileName,
        sourceDirectory,
        migrationDirectory,
      );
    }
    console.warn(`schema not found at ${fileName}`);
  } else {
    fileName = path.join(sourceDirectory, 'schema.ts');
    if (fs.existsSync(fileName)) {
      return resolveSchemaLocation(
        fileName,
        sourceDirectory,
        migrationDirectory,
      );
    }
  }

  fileName = path.relative(
    cwd,
    path.join(sourceDirectory, 'schema.ts'),
  );

  while (true) {
    fileName = await cli.prompt('Where is your schema file?', {
      default: fileName,
    });
    if (!fs.existsSync(path.join(cwd, fileName))) {
      console.warn(`schema not found at ${fileName}`);
      continue;
    }

    return resolveSchemaLocation(
      path.join(cwd, fileName),
      sourceDirectory,
      migrationDirectory,
    );
  }
}

function resolveSchemaLocation(
  fileName: string,
  sourceDirectory: string,
  migrationDirectory: string,
): SchemaLocation {
  return {
    fileName,
    directory: path.dirname(fileName),
    sourceDirectory,
    migrationDirectory,
  };
}

export async function getSchemaInformation(
  astContext: AstContext,
  location: SchemaLocation
): Promise<SchemaInformation | null> {
  const sourceFile = astContext.get(location.fileName);
  if (!sourceFile) {
    throw new Error(`source file ${location.fileName} not found`);
  }

  const schemas = parseSchemas(sourceFile);

  if (schemas.length === 0) {
    console.warn(`No schema found in ${location.fileName}`);
    return null;
  }

  let schema = schemas[0];
  if (schemas.length > 1) {
    const response: any = await inquirer.prompt([
      {
        name: 'schema',
        message: 'select a schema',
        type: 'list',
        choices: schemas.map(s => s.variable.name),
      },
    ]);
    schema = schemas.filter(s => s.variable.name === response.schema)[0];
  }

  return new SchemaInformation(schema);
}

export class SchemaInformation {
  constructor(private schemaDeclaration: SchemaDeclaration) {

  }

  get variableName() {
    return this.schemaDeclaration.variable.name;
  }

  getMigrationTree() {
    return parseSchemaMigrations(this.schemaDeclaration.variable);
  }

  getRelationalSchema(): RelationalSchemaDescription {
    return parseRelationalSchema(this.schemaDeclaration.variable);
  }

  getMigrationCalls() {
    return parseSchemaMigrationCalls(this.schemaDeclaration.variable);
  }
}