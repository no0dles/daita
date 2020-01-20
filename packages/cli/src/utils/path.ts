import * as path from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';
import cli from 'cli-ux';
import {Command} from '@oclif/command';
import * as inquirer from 'inquirer';
import {MigrationTree} from '@daita/core';
import {DatabaseSchema} from '@daita/core/dist/schema/database-schema';
import {
  getSchemas,
  parseModelSchema,
  parseSchemaMigrations,
} from '../migration/generation';
import {parseSourceFile} from '../migration/generation/utils';

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
  flags: { schema: string | undefined, cwd: string | undefined },
  cmd: Command,
): Promise<SchemaLocation> {
  const cwd = flags.cwd ? path.resolve(flags.cwd) : process.cwd();
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

  if (flags.schema) {
    const fileName = path.join(cwd, flags.schema);

    if (fs.existsSync(fileName)) {
      return resolveSchemaLocation(
        fileName,
        sourceDirectory,
        migrationDirectory,
      );
    } else {
      cmd.warn(`schema not found at ${fileName}`);
    }
  } else {
    const fileName = path.join(sourceDirectory, 'schema.ts');
    if (fs.existsSync(fileName)) {
      return resolveSchemaLocation(
        fileName,
        sourceDirectory,
        migrationDirectory,
      );
    }
  }

  let fileName = path.relative(
    cwd,
    path.join(sourceDirectory, 'schema.ts'),
  );
  while (true) {
    fileName = await cli.prompt('Where is your schema file?', {
      default: fileName,
    });
    if (!fs.existsSync(path.join(cwd, fileName))) {
      cmd.warn(`schema not found at ${fileName}`);
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
    fileName: fileName,
    directory: path.dirname(fileName),
    sourceDirectory,
    migrationDirectory,
  };
}

export async function getSchemaInformation(
  location: SchemaLocation,
  cmd: Command,
): Promise<SchemaInformation | null> {
  const sourceFile = parseSourceFile(location.fileName);
  const schemas = getSchemas(sourceFile);

  if (schemas.length === 0) {
    cmd.warn(`No schema found in ${location.fileName}`);
    return null;
  }

  let schema = schemas[0];
  if (schemas.length > 1) {
    const response: any = await inquirer.prompt([
      {
        name: 'schema',
        message: 'select a schema',
        type: 'list',
        choices: schemas.map(s => s.name),
      },
    ]);
    schema = schemas.filter(s => s.name === response.schema)[0];
  }

  const modelSchema = parseModelSchema(sourceFile, schema.name);
  const {migrationTree, migrationFiles} = parseSchemaMigrations(
    sourceFile,
    schema.name,
  );

  return {
    migrationFiles,
    migrationTree,
    modelSchema,
    variableName: schema.name,
  };
}

export interface SchemaInformation {
  variableName: string;
  migrationTree: MigrationTree;
  modelSchema: DatabaseSchema;
  migrationFiles: {
    [key: string]: { sourceFile: ts.SourceFile; name: string; id: string };
  };
}
