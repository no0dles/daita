import { AstVariableDeclaration } from '../../ast/ast-variable-declaration';
import { AstArrayValue } from '../../ast/ast-array-value';
import { convertValue } from './convert-value';
import { AstError } from '../../ast/utils';
import { AstClassDeclaration } from '../../ast/ast-class-declaration';
import { parseTableDescription } from './parse-table-description';
import { RelationalSchemaDescription } from '../../../orm/schema';

export function parseRelationalSchemaTableSeed(
  schema: RelationalSchemaDescription,
  schemaVariable: AstVariableDeclaration,
) {
  const seeds = schemaVariable.callsByName('seed');
  for (const seed of seeds) {
    let classArgument = seed.argumentAt(0);
    let seedValue = seed.argumentAt(1);

    if (!(classArgument instanceof AstClassDeclaration)) {
      throw new AstError(
        classArgument?.node ?? seed.node,
        'invalid seed argument without class',
      );
    }
    const tableDescription = parseTableDescription(classArgument);
    const table = schema.table(tableDescription);

    if (seedValue instanceof AstVariableDeclaration) {
      seedValue = seedValue.value;
    }

    if (seedValue instanceof AstArrayValue) {
      for (const ruleElement of seedValue.elements) {
        const seed = convertValue(ruleElement);
        const seedKeys: any = {};
        for (const primaryKey of table.primaryKeys) {
          seedKeys[primaryKey.key] = seed[primaryKey.key];
          delete seed[primaryKey.key];
        }
        table.insertSeed(seedKeys, seed);
      }
    } else {
      throw new AstError(seedValue?.node ?? seed.node, 'unable to parse seed');
    }
  }
}
