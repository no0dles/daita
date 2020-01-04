import { expect } from 'chai';
import {
  DocumentCollectionSchemaCollectionFieldType,
  getSourceCodeSchema,
  SourceCodeModel,
  SourceCodeModelProperty,
  SourceCodeModelPropertyType,
} from '@daita/core';
import { SourceCodeModelPrimitivePropertyType } from '@daita/core/dist/model/source-code-model-primitive-property-type';
import { SourceCodeModelArrayPropertyType } from '@daita/core/dist/model/source-code-model-array-property-type';
import { SourceCodeModelUnionPropertyType } from '@daita/core/dist/model/source-code-model-union-property-type';

function testCollectionPropertyType(
  type: SourceCodeModelPropertyType,
  result: DocumentCollectionSchemaCollectionFieldType,
) {
  const model = new SourceCodeModel('foo');
  model.addProperty(new SourceCodeModelProperty('bar', type));
  const schema = getSourceCodeSchema([model], []);
  const collection = schema.collection('foo');
  expect(collection).not.be.eq(null);
  if (collection) {
    expect(collection.field('bar').type).to.be.eq(result);
  }
}

describe('source-code-schema-builder', () => {
  it('should parse type string', () => {
    testCollectionPropertyType(
      new SourceCodeModelPrimitivePropertyType('string'),
      'string',
    );
  });
  it('should parse type number', () => {
    testCollectionPropertyType(
      new SourceCodeModelPrimitivePropertyType('number'),
      'number',
    );
  });
  it('should parse type string | null', () => {
    testCollectionPropertyType(
      new SourceCodeModelUnionPropertyType([
        new SourceCodeModelPrimitivePropertyType('string'),
        new SourceCodeModelPrimitivePropertyType('null'),
      ]),
      'string',
    );
  });
  it('should parse type number | null', () => {
    testCollectionPropertyType(
      new SourceCodeModelUnionPropertyType([
        new SourceCodeModelPrimitivePropertyType('number'),
        new SourceCodeModelPrimitivePropertyType('null'),
      ]),
      'number',
    );
  });
  it('should not parse type number | string', () => {
    testCollectionPropertyType(
      new SourceCodeModelUnionPropertyType([
        new SourceCodeModelPrimitivePropertyType('number'),
        new SourceCodeModelPrimitivePropertyType('string'),
      ]),
      'invalid',
    );
  });
  it('should parse type number[]', () => {
    testCollectionPropertyType(
      new SourceCodeModelArrayPropertyType(
        new SourceCodeModelPrimitivePropertyType('number'),
      ),
      'number[]',
    );
  });
  it('should parse type string[]', () => {
    testCollectionPropertyType(
      new SourceCodeModelArrayPropertyType(
        new SourceCodeModelPrimitivePropertyType('string'),
      ),
      'string[]',
    );
  });
});