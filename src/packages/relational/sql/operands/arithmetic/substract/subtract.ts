import { SubtractDescription } from './subtract-description';

export function subtract(left: number, right: number): number {
  return (<SubtractDescription>{ subtract: { left: left, right: right } }) as any;
}
