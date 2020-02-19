import * as ts from 'typescript';

export class AstType {
  constructor(private typeNode: ts.TypeNode) {
  }
}