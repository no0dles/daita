import { SourceCodeModelProperty } from './source-code-model-property';

export class SourceCodeModel {
  properties: SourceCodeModelProperty[] = [];
  primaryKeys: string[] = [];

  constructor(public name: string) {}

  addProperty(property: SourceCodeModelProperty) {
    this.properties.push(property);
  }

  setPrimaryKeys(keys: string[]) {
    this.primaryKeys.push(...keys);
  }
}
