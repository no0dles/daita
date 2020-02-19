import {parseSchemaPermissions} from './parse-migration';
import * as ts from 'typescript';
import * as path from 'path';
import {parseSourceFile} from './utils';

describe('parse-migration', () => {
  it('should parse permission', () => {
    const schemaCode = 'class Mountain {id!: string;name!: string;}\n' +
      'const permission = new PermissionBuilder();\n' +
      'permission.push(Mountain, {type: \'role\', role: \'admin\', select: true})\n' +
      'const schema = new RelationalSchema();\n' +
      'schema.permission(Mountain);';

    const createdFiles: {[key:string]: string} = {};
    const host = ts.createCompilerHost({});
    host.writeFile = (fileName: string, contents: string) => createdFiles[fileName] = contents

    const files = [
      path.join(process.cwd(), 'test/schemas/auth-schema/src/schema.ts'),
      path.join(process.cwd(), 'test/schemas/auth-schema/src/permissions.ts'),
    ];
    const program = ts.createProgram(files, {}, host);
    const emitResult = program.emit();
    console.log(createdFiles);

    // const virtualFileName = 'schema.ts';
    // const sourceFile = ts.createSourceFile(virtualFileName, schemaCode, ts.ScriptTarget.ES5);
    //
    const sourceFile = parseSourceFile('test/schemas/auth-schema/src/schema.ts');
    const permissions = parseSchemaPermissions(sourceFile, 'schema');
    console.log(permissions);
  });
});