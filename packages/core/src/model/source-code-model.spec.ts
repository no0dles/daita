import {assert} from 'chai';
import {getSourceCodeProperty} from '../schema/source-code-schema-builder';
import {SourceCodeModelPrimitivePropertyType} from './source-code-model-primitive-property-type';
import {SourceCodeModelProperty} from './source-code-model-property';
import {SourceCodeModelUnionPropertyType} from './source-code-model-union-property-type';

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
