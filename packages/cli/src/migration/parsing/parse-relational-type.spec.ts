import {AstType} from '../../ast/ast-type';
import {parseRelationalType} from './parse-relational-type';
import {AstObjectValue} from '../../ast/ast-object-value';
import * as ts from 'typescript';
import { RelationalTableSchemaTableFieldType } from '@daita/orm';
import { AstSourceFile } from '../../ast/ast-source-file';

function testRelationalPropertyType(
  type: AstType | null,
  initializer: AstObjectValue | null,
  result: RelationalTableSchemaTableFieldType,
) {
  const relationalType = parseRelationalType({type, initializer} as any);
  expect(relationalType).toEqual(result);
}

describe('parse-relational-type', () => {
  it('should parse type boolean initalizer false', () => {
    testRelationalPropertyType(
      null,
      new AstObjectValue(null as any, ts.createFalse()),
      'boolean',
    );
  });

  it('should parse type boolean initalizer true', () => {
    testRelationalPropertyType(
      null,
      new AstObjectValue(null as any, ts.createTrue()),
      'boolean',
    );
  });

  it('should parse type string initalizer', () => {
    testRelationalPropertyType(
      null,
      new AstObjectValue(null as any, ts.createStringLiteral('foo')),
      'string',
    );
  });

  it('should parse type string', () => {
    testRelationalPropertyType(
      {kind: 'string', allowUndefined: false},
      null,
      'string',
    );
  });
  it('should parse type number', () => {
    testRelationalPropertyType(
      {kind: 'number', allowUndefined: false},
      null,
      'number',
    );
  });
  it('should parse type string | null', () => {
    testRelationalPropertyType(<AstType>{
        kind: 'union',
        allowUndefined: false,
        types: [
          {kind: 'string'},
          {kind: 'null'},
        ],
      },
      null,
      'string',
    );
  });
  it('should parse type number | null', () => {
    testRelationalPropertyType(<AstType>{
        kind: 'union',
        types: [
          {kind: 'number'},
          {kind: 'null'},
        ],
        allowUndefined: false,
      },
      null,
      'number',
    );
  });
  it('should not parse type number | string', () => {
    try {
      testRelationalPropertyType(<AstType>{
          kind: 'union',
          types: [
            {kind: 'number'},
            {kind: 'string'},
          ],
          allowUndefined: false,
        },
        null,
        'string',
      );
    } catch (e) {
      expect(e.message).toEqual('unsupported type')
    }
  });
  it('should parse type number[]', () => {
    testRelationalPropertyType(<AstType>{
        kind: 'array',
        allowUndefined: false,
        elementType: {kind: 'number'},
      },
      null,
      'number[]',
    );
  });
  it('should parse type string[]', () => {
    testRelationalPropertyType(<AstType>{
        kind: 'array',
        allowUndefined: false,
        elementType: {kind: 'string'},
      },
      null,
      'string[]',
    );
  });
});
