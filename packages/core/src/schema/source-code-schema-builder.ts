import {
  SourceCodeModel,
  SourceCodeModelProperty,
  SourceCodeModelPropertyType,
} from '../model';
import { SourceCodeModelArrayPropertyType } from '../model/source-code-model-array-property-type';
import { SourceCodeModelPrimitivePropertyType } from '../model/source-code-model-primitive-property-type';
import { SourceCodeModelReferencePropertyType } from '../model/source-code-model-reference-property-type';
import { SourceCodeModelUnionPropertyType } from '../model/source-code-model-union-property-type';
import { DatabaseSchema } from './database-schema';
import { DatabaseSchemaCollection } from './database-schema-collection';
import { DatabaseSchemaTable } from './database-schema-table';
import { DocumentCollectionSchemaCollectionField } from './document-collection-schema-collection-field';
import { RelationalTableSchemaTableField } from './relational-table-schema-table-field';
import { RelationalTableSchemaTableFieldType } from './relational-table-schema-table-field-type';
import {RelationalTableSchemaTableReferenceKey} from "./relational-table-schema-table-reference-key";

export function capitalize(word: string) {
  if (!word) return word;
  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

export function getSourceCodeSchema(
  collections: SourceCodeModel[],
  tables: SourceCodeModel[],
) {
  const collectionMap: { [key: string]: DatabaseSchemaCollection } = {};
  const tableMap: { [key: string]: DatabaseSchemaTable } = {};

  for (const model of collections) {
    const fieldsMap: { [key: string]: DocumentCollectionSchemaCollectionField } = {};
    for (const property of model.properties) {
      fieldsMap[property.name] = getSourceCodeProperty(property);
    }
    collectionMap[model.name] = new DatabaseSchemaCollection(model.name, fieldsMap);
  }
  for (const model of tables) {
    const fieldsMap: { [key: string]: RelationalTableSchemaTableField } = {};
    const foreignKeys: RelationalTableSchemaTableReferenceKey[] = [];
    for (const property of model.properties) {
      if (property.type instanceof SourceCodeModelReferencePropertyType) {
        const foreignKey = {
          name: property.name,
          table: property.type.referenceModel.name,
          foreignKeys: property.type.referenceModel.primaryKeys,
          keys: property.type.referenceModel.primaryKeys.map(key => `${property.name}${capitalize(key)}`),
        };
        foreignKeys.push(foreignKey);
      } else {
        const srcProp = getSourceCodeProperty(property);
        fieldsMap[property.name] = srcProp;
      }
    }
    tableMap[model.name] = new DatabaseSchemaTable(model.name, fieldsMap, model.primaryKeys, foreignKeys); //TODO
  }

  return new DatabaseSchema(collectionMap, tableMap);
}

export function getSourceCodeProperty(
  property: SourceCodeModelProperty,
): DocumentCollectionSchemaCollectionField {
  return {
    name: property.name,
    type: parseType(property.type),
    defaultValue: null,
    required: isRequired(property.type),
  };
}

function parseType(
  type: SourceCodeModelPropertyType,
): RelationalTableSchemaTableFieldType {
  if (type instanceof SourceCodeModelUnionPropertyType) {
    const subTypes = type.types
      .filter(t => {
        if (!(t instanceof SourceCodeModelPrimitivePropertyType)) return true;
        return t.type !== 'null';
      })
      .map(parseType);
    if (subTypes.length === 1) {
      return subTypes[0];
    }
    return 'invalid';
  } else if (type instanceof SourceCodeModelPrimitivePropertyType) {
    switch (type.type) {
      case 'number':
      case 'boolean':
      case 'string':
        return type.type;
    }
  } else if (type instanceof SourceCodeModelReferencePropertyType) {

  } else if (type instanceof SourceCodeModelArrayPropertyType) {
    const subType = parseType(type.itemType);
    if (subType === 'string') {
      return 'string[]';
    } else if(subType === 'number') {
      return 'number[]';
    }
  }

  return 'invalid';
}

function isRequired(type: SourceCodeModelPropertyType) {
  if (!(type instanceof SourceCodeModelUnionPropertyType)) {
    return true;
  }

  for (const subType of type.types) {
    if (subType instanceof SourceCodeModelPrimitivePropertyType) {
      if (subType.type === 'null') {
        return false;
      }
    }
  }

  return true;
}
