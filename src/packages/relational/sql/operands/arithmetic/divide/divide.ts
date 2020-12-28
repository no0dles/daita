import { DivideDescription } from './divide-description';

export function divide(left: number, right: number): number {
  return (<DivideDescription>{ divide: { left: left, right: right } }) as any;
}
