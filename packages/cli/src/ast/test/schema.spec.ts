import { parseSchemas } from '../../migration/parsing/parse-schemas';
import * as path from 'path';
import { AstContext } from '../ast-context';

describe('schema', () => {
  it('should', () => {
    const astContext = new AstContext();
    const sourceFile = astContext.get(path.join(__dirname, './schema.ts'));
    const schemas = parseSchemas(sourceFile!);
    const variable = schemas[0].variable;
    for (const tableCall of variable.callsByName('table')) {
      const optionsArg = tableCall.argumentAt(1);
      console.log(optionsArg);
    }
  });
});
