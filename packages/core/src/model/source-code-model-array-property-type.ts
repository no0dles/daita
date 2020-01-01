import {SourceCodeModelPropertyType} from './source-code-model-property-type';

export class SourceCodeModelArrayPropertyType {
  constructor(public itemType: SourceCodeModelPropertyType) {}
}
