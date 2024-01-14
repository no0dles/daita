import { isKind } from './is-kind';

describe('utils/is-kind', () => {
  it('should return false for null', () => {
    expect(isKind(null, ['foo'])).toBeFalsy();
  });
  it('should return false for undefined', () => {
    expect(isKind(undefined, ['foo'])).toBeFalsy();
  });
  it('should return false for string', () => {
    expect(isKind('test', ['foo'])).toBeFalsy();
  });
  it('should return true if props exists', () => {
    expect(isKind({ foo: false }, ['foo'])).toBeTruthy();
  });
  it('should return false if not all props exists', () => {
    expect(isKind({ foo: false }, ['foo', 'bar'])).toBeFalsy();
  });
  it('should return true if props is method', () => {
    const value = {
      foo: () => true,
    };
    expect(isKind(value, ['foo'])).toBeTruthy();
  });
});
