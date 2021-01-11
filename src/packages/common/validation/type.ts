import { NumberType, NumberTypeType } from './number-type';
import { StringType, StringTypeType } from './string-type';
import { BooleanType, BooleanTypeType } from './boolean-type';
import { NullType, NullTypeType } from './null-type';
import { DateType, DateTypeType } from './date-type';
import { AnyType, AnyTypeType } from './any-type';
import { UndefinedType, UndefinedTypeType } from './undefined-type';
import { ObjectType, ObjectTypeType } from './object-type';
import { UnionType, UnionTypeType } from './union-type';
import { ArrayType, ArrayTypeType } from './array-type';
import { MapType, MapTypeType } from './map-type';

export type Type =
  | DateType
  | BooleanType
  | NumberType
  | StringType
  | ObjectType
  | ArrayType
  | MapType
  | UnionType
  | UndefinedType
  | NullType
  | AnyType;

export const TypeType: Type = {
  type: 'union',
  unionTypes: [
    DateTypeType,
    BooleanTypeType,
    NumberTypeType,
    StringTypeType,
    ObjectTypeType,
    ArrayTypeType,
    MapTypeType,
    UnionTypeType,
    UndefinedTypeType,
    NullTypeType,
    AnyTypeType,
  ],
};
