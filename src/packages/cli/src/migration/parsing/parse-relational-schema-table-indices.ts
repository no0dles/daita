import { AstObjectValue } from '../../ast/ast-object-value';
import { AstArrayValue } from '../../ast/ast-array-value';
import { AstError, getArrayValue, getStringValue } from '../../ast/utils';
import { AstLiteralValue, AstStringLiteralValue } from '../../ast/ast-literal-value';
import { addIndexToTable, SchemaDescription } from '@daita/orm';
import { TableDescription } from '@daita/relational';

export function parseRelationalSchemaTableIndices(
  schema: SchemaDescription,
  table: TableDescription<any>,
  optionsArgument: AstObjectValue,
): SchemaDescription {
  const index = optionsArgument.prop('indices');
  if (!index) {
    return schema;
  }

  const indexObject = index.value;
  if (!(indexObject instanceof AstObjectValue)) {
    throw new Error('index should be an object literal');
  }

  for (const indexProperty of indexObject.props) {
    const indexValue = indexProperty.value;
    if (indexValue instanceof AstArrayValue) {
      schema = addIndexToTable(schema, table, {
        key: indexProperty.name,
        fields: getArrayValue(indexValue, (elm) => getStringValue(elm)),
        unique: false,
      });
    } else if (indexValue instanceof AstObjectValue) {
      const columnsProp = indexValue.requiredProp('columns').value;
      if (columnsProp instanceof AstArrayValue) {
        const fields = getArrayValue(columnsProp, (elm) => getStringValue(elm));
        const unique = indexValue.hasProp('unique') ? indexValue.booleanProp('unique') : false;
        schema = addIndexToTable(schema, table, { key: indexProperty.name, fields, unique });
      } else if (columnsProp instanceof AstStringLiteralValue) {
        const unique = indexValue.hasProp('unique') ? indexValue.booleanProp('unique') : false;
        schema = addIndexToTable(schema, table, {
          key: indexProperty.name,
          fields: [getStringValue(columnsProp)],
          unique,
        });
      } else {
        throw new AstError(indexValue.node, 'invalid index');
      }
    } else if (indexValue instanceof AstLiteralValue) {
      schema = addIndexToTable(schema, table, {
        key: indexProperty.name,
        fields: [getStringValue(indexValue)],
        unique: false,
      });
    } else if (indexValue) {
      throw new AstError(indexValue.node, `invalid index`);
    } else {
      throw new AstError(indexProperty.node, `invalid index`);
    }
  }

  return schema;
}
