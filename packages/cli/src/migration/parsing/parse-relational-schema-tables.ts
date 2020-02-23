import {AstVariable} from '../../ast/ast-variable';
import {SchemaTable} from './schema-table';

export function parseRelationalSchemaTables(
  schemaVariable: AstVariable,
) {
  const schemaTableMap: { [key: string]: SchemaTable } = {};

  const calls = schemaVariable.getCalls({name: 'table'});
  for (const call of calls) {
    const classArgument = call.argument(0);
    const optionsArgument = call.argument(1);

    if (!classArgument) {
      throw new Error('invalid table argument without class');
    }
    const classDeclaration = classArgument.classDeclaration;
    if (!classDeclaration) {
      throw new Error(`unable to find class ${classArgument.className} in schema ${schemaVariable.name}`);
    }

    if (!classDeclaration.name) {
      throw new Error('missing class name');
    }

    if (schemaTableMap[classDeclaration.name]) {
      throw new Error('name already registered');
    }

    const key = optionsArgument?.objectValue?.property('key');
    if (key) {
      if (key.stringValue) {
        schemaTableMap[classDeclaration.name] = {
          classDeclaration,
          options: {
            key: [key.stringValue],
          },
        };
      } else if (key.arrayValue) {
        const keys = new Array<string>();
        for (const item of key.arrayValue) {
          if (item.stringValue) {
            keys.push(item.stringValue);
          } else {
            throw new Error('not all keys are valid');
          }
        }

        schemaTableMap[classDeclaration.name] = {
          classDeclaration,
          options: {
            key: keys,
          },
        };
      }
    } else {
      schemaTableMap[classDeclaration.name] = {
        classDeclaration,
        options: {
          key: ['id'],
        },
      };
    }
  }

  return schemaTableMap;
}
