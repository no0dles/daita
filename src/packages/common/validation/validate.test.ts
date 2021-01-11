import { Type } from './type';
import { ValidationError } from './type-validation-error';
import { validate } from './validate';
import { isBackwardCompatible } from './backward-compatible';

export function validateType(
  type: Type,
  value: any,
  expectedErrors: ValidationError[]
) {
  const errors = Array.from(validate(type, value));
  expect(errors).toEqual(expectedErrors);
}

export interface TypeTest {
  type: Type;
  errorMessage: string;
  validValues?: any[];
  invalidValues?: any[];
  backwardCompatibleTypes?: Type[];
  notBackwardCompatibleTypes?: Type[];
  errorPath?: string[];
}

export function typeTest(test: TypeTest) {
  if (test.validValues && test.validValues.length > 0) {
    it.each(test.validValues)('should allow value %s', (val) => {
      validateType(test.type, val, []);
    });
  }

  if (test.invalidValues && test.invalidValues.length > 0) {
    it.each(test.invalidValues)('should not allow value %s', (val) => {
      validateType(test.type, val, [
        { message: test.errorMessage, path: test.errorPath ?? [] },
      ]);
    });
  }

  if (test.backwardCompatibleTypes && test.backwardCompatibleTypes.length > 0) {
    it.each(test.backwardCompatibleTypes)(
      'should be backward compatible %s',
      (val) => {
        expect(isBackwardCompatible(test.type, val)).toBeTruthy();
      }
    );
  }
  if (
    test.notBackwardCompatibleTypes &&
    test.notBackwardCompatibleTypes.length > 0
  ) {
    it.each(test.notBackwardCompatibleTypes)(
      'should be not backward compatible %s',
      (val) => {
        expect(isBackwardCompatible(test.type, val)).toBeFalsy();
      }
    );
  }
}
