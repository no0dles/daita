import { AstObjectValue } from '../../ast/ast-object-value';
import { AstArrayValue } from '../../ast/ast-array-value';
import { AstError, getArrayValue, getStringValue } from '../../ast/utils';
import { AstLiteralValue, AstStringLiteralValue } from '../../ast/ast-literal-value';
import { addIndexToTable, SchemaTableDescription } from '@daita/orm/schema/description/relational-schema-description';

export function parseRelationalSchemaTableIndices(table: SchemaTableDescription, optionsArgument: AstObjectValue) {
  const index = optionsArgument.prop('indices');
  if (!index) {
    return;
  }

  const indexObject = index.value;
  if (!(indexObject instanceof AstObjectValue)) {
    throw new Error('index should be an object literal');
  }

  for (const indexProperty of indexObject.props) {
    const indexValue = indexProperty.value;
    if (indexValue instanceof AstArrayValue) {
      addIndexToTable(table, {
        key: indexProperty.name,
        fields: getArrayValue(indexValue, (elm) => getStringValue(elm)),
        unique: false,
      });
    } else if (indexValue instanceof AstObjectValue) {
      const columnsProp = indexValue.requiredProp('columns').value;
      if (columnsProp instanceof AstArrayValue) {
        const fields = getArrayValue(columnsProp, (elm) => getStringValue(elm));
        const unique = indexValue.hasProp('unique') ? indexValue.booleanProp('unique') : false;
        addIndexToTable(table, { key: indexProperty.name, fields, unique });
      } else if (columnsProp instanceof AstStringLiteralValue) {
        const unique = indexValue.hasProp('unique') ? indexValue.booleanProp('unique') : false;
        addIndexToTable(table, { key: indexProperty.name, fields: [getStringValue(columnsProp)], unique });
      } else {
        throw new AstError(indexValue.node, 'invalid index');
      }
    } else if (indexValue instanceof AstLiteralValue) {
      addIndexToTable(table, { key: indexProperty.name, fields: [getStringValue(indexValue)], unique: false });
    } else if (indexValue) {
      throw new AstError(indexValue.node, `invalid index`);
    } else {
      throw new AstError(indexProperty.node, `invalid index`);
    }
  }
}
