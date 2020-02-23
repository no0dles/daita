import {AstVariable} from '../../ast/ast-variable';

export function parseSchemaMigrationVariables(schemaVariable: AstVariable) {
  const variables = new Array<AstVariable>();
  const migrationCalls = schemaVariable.getCalls({name: 'migration'});
  for (const migrationCall of migrationCalls) {
    const migrationClassArg = migrationCall.argument(0);
    if (!migrationClassArg) {
      throw new Error('missing first arg in migration');
    }
    const migrationVariable = migrationClassArg.variable;
    if (!migrationVariable) {
      throw new Error('first arg is no variable');
    }
    variables.push(migrationVariable);
  }
  return variables;
}