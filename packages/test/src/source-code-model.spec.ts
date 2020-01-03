import {assert} from 'chai';
import {getSourceCodeProperty} from '@daita/core/dist/schema/source-code-schema-builder';
import {SourceCodeModelPrimitivePropertyType} from '@daita/core/dist/model/source-code-model-primitive-property-type';
import {SourceCodeModelProperty} from '@daita/core';
import {SourceCodeModelUnionPropertyType} from '@daita/core/dist/model/source-code-model-union-property-type';

describe('model', () => {
  it('ModelSchemaCollectionField', () => {
    const property = new SourceCodeModelProperty('test', new SourceCodeModelUnionPropertyType([
      new SourceCodeModelPrimitivePropertyType('string'),
      new SourceCodeModelPrimitivePropertyType('null'),
    ]));
    const field = getSourceCodeProperty(property);
    assert.equal(field.required, false);
    assert.equal(field.name, 'test');
    assert.equal(field.type, 'string');
  });
});
