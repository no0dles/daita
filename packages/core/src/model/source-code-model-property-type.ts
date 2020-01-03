import { SourceCodeModelArrayPropertyType } from './source-code-model-array-property-type';
import { SourceCodeModelPrimitivePropertyType } from './source-code-model-primitive-property-type';
import { SourceCodeModelReferencePropertyType } from './source-code-model-reference-property-type';
import { SourceCodeModelUnionPropertyType } from './source-code-model-union-property-type';

export type SourceCodeModelPropertyType =
  | SourceCodeModelArrayPropertyType
  | SourceCodeModelReferencePropertyType
  | SourceCodeModelUnionPropertyType
  | SourceCodeModelPrimitivePropertyType;
