import {RelationalTableSchemaTableReferenceKey} from '@daita/core/dist/schema/relational-table-schema-table-reference-key';
import {capitalize} from '../utils';
import {DatabaseSchemaTable} from '@daita/core/dist/schema/database-schema-table';
import {SchemaTable} from './schema-table';
import {RelationalTableSchemaTableField} from '@daita/core';
import {parseRelationalType} from './parse-relational-type';
import {AstPropertyDeclaration} from '../../ast/ast-property-declaration';

export function parseRelationalSchemaTable(model: SchemaTable, schemaTableMap: { [key: string]: SchemaTable }): DatabaseSchemaTable {
  if (!model.classDeclaration.name) {
    throw new Error(`missing table class name`);
  }

  const fieldsMap: { [key: string]: RelationalTableSchemaTableField } = {};
  const foreignKeys: RelationalTableSchemaTableReferenceKey[] = [];

  for (const property of model.classDeclaration.getProperties({includedInherited: true})) {
    if (!property.name) {
      throw new Error('missing prop name');
    }

    if (property.type && property.type.kind === 'reference' && property.type.referenceName !== 'Date') {
      const referenceClass = property.type.reference;
      if (!referenceClass) {
        throw new Error('invalid reference');
      }

      if (!referenceClass.name) {
        throw new Error('reference name is missing');
      }

      const referenceTable = schemaTableMap[referenceClass.name];
      if (!referenceTable) {
        throw new Error('reference not registered');
      }

      const foreignKey: RelationalTableSchemaTableReferenceKey = {
        name: property.name,
        table: referenceClass.name,
        foreignKeys: referenceTable.options.key,
        keys: referenceTable.options.key.map(
          key => `${property.name}${capitalize(key)}`,
        ),
        required: isRequired(property),
      };
      foreignKeys.push(foreignKey);
    } else {
      try {
        fieldsMap[property.name] = {
          name: property.name,
          type: parseRelationalType(property),
          defaultValue: property?.initializer?.anyValue,
          required: isRequired(property),
        };
      } catch (e) {
        throw new Error(`${model.classDeclaration.name}.${property.name}: ${e.message}`);
      }
    }
  }

  return new DatabaseSchemaTable(
    model.classDeclaration.name,
    fieldsMap,
    model.options.key,
    foreignKeys,
  );
}


function isRequired(property: AstPropertyDeclaration) {
  if (!property.type) {
    return true;
  }

  if (property.type.allowUndefined) {
    return false;
  }

  if (property.type.kind === 'union') {
    return !property.type.types.some(t => t.kind === 'null' || t.kind === 'undefined');
  }

  return true;
}
