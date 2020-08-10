import { RelationalTableDescription } from '@daita/orm';
import { RelationalTableIndexDescription } from '@daita/orm';
import { AstObjectValue } from '../../ast/ast-object-value';
import { AstArrayValue } from '../../ast/ast-array-value';
import { AstError, getArrayValue, getStringValue } from '../../ast/utils';
import { AstLiteralValue, AstStringLiteralValue } from '../../ast/ast-literal-value';

export function parseRelationalSchemaTableIndices(table: RelationalTableDescription, optionsArgument: AstObjectValue) {
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
      addIndex(table, indexProperty.name, getArrayValue(indexValue, elm => getStringValue(elm)), false);
    } else if (indexValue instanceof AstObjectValue) {
      const columnsProp = indexValue.requiredProp('columns').value;
      if (columnsProp instanceof AstArrayValue) {
        const columns = getArrayValue(columnsProp, elm => getStringValue(elm));
        const unique = indexValue.hasProp('unique') ? indexValue.booleanProp('unique') : false;
        addIndex(table, indexProperty.name, columns, unique);
      } else if (columnsProp instanceof AstStringLiteralValue) {
        const unique = indexValue.hasProp('unique') ? indexValue.booleanProp('unique') : false;
        addIndex(table, indexProperty.name, [getStringValue(columnsProp)], unique);
      } else {
        throw new AstError(indexValue.node, 'invalid index');
      }
    } else if (indexValue instanceof AstLiteralValue) {
      addIndex(table, indexProperty.name, [getStringValue(indexValue)], false);
    } else if (indexValue) {
      throw new AstError(indexValue.node, `invalid index`);
    } else {
      throw new AstError(indexProperty.node, `invalid index`);
    }
  }
}

function addIndex(table: RelationalTableDescription, name: string, columns: string[], unique: boolean) {
  const idx = new RelationalTableIndexDescription(name, table, columns.map(f => table.field(f)), unique);
  table.addIndex(name, idx);
}
