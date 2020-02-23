import {AstType} from '../../ast/ast-type';
import {expect} from 'chai';
import {parseRelationalType} from './parse-relational-type';
import {DocumentCollectionSchemaCollectionFieldType} from '@daita/core';
import {AstObjectValue} from '../../ast/ast-object-value';
import * as ts from 'typescript';

function testCollectionPropertyType(
  type: AstType | null,
  initializer: AstObjectValue | null,
  result: DocumentCollectionSchemaCollectionFieldType,
) {
  const relationalType = parseRelationalType({type, initializer} as any);
  expect(relationalType).to.be.eq(result);
}

describe('parse-relational-type', () => {
  it('should parse type boolean initalizer false', () => {
    testCollectionPropertyType(
      null,
      new AstObjectValue(ts.createFalse()),
      'boolean',
    );
  });

  it('should parse type boolean initalizer true', () => {
    testCollectionPropertyType(
      null,
      new AstObjectValue(ts.createTrue()),
      'boolean',
    );
  });

  it('should parse type string initalizer', () => {
    testCollectionPropertyType(
      null,
      new AstObjectValue(ts.createStringLiteral('foo')),
      'string',
    );
  });

  it('should parse type string', () => {
    testCollectionPropertyType(
      {kind: 'string', allowUndefined: false},
      null,
      'string',
    );
  });
  it('should parse type number', () => {
    testCollectionPropertyType(
      {kind: 'number', allowUndefined: false},
      null,
      'number',
    );
  });
  it('should parse type string | null', () => {
    testCollectionPropertyType(<AstType>{
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
    testCollectionPropertyType(<AstType>{
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
      testCollectionPropertyType(<AstType>{
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
      expect(e.message).to.be.eq('unsupported type')
    }
  });
  it('should parse type number[]', () => {
    testCollectionPropertyType(<AstType>{
        kind: 'array',
        allowUndefined: false,
        elementType: {kind: 'number'},
      },
      null,
      'number[]',
    );
  });
  it('should parse type string[]', () => {
    testCollectionPropertyType(<AstType>{
        kind: 'array',
        allowUndefined: false,
        elementType: {kind: 'string'},
      },
      null,
      'string[]',
    );
  });
});