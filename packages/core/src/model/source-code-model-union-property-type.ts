import { SourceCodeModelPropertyType } from './source-code-model-property-type';

export class SourceCodeModelUnionPropertyType {
  constructor(public types: SourceCodeModelPropertyType[]) {}
}
